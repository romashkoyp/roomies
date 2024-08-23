const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase, initialRooms } = require('./seed_db')
const { User, Room } = require('../../models')
const jwt = require('jsonwebtoken')
const { SECRET, PORT } = require('../../util/config')
const { dayCreator } = require('../Jest/dayCreator')

describe('Rooms API', () => {
  let server
  let adminToken
  let user1Token
  let disabledAdminToken

  let tomorrow
  let dTomorrow

  let second
  let dSecond

  let third
  let dThird
  
  beforeAll(async () => {
    await start()
    server = app.listen(PORT)

    const dayData = await dayCreator()

    tomorrow = dayData.tomorrow
    dTomorrow = dayData.dTomorrow
    second = dayData.dSecond
    dSecond = dayData.dSecond
    third = dayData.third
    dThird = dayData.dThird
  })
  
  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await seedDatabase()

    const admin = await User.findOne({ where: { username: 'testadmin@admin.com' } })
    adminToken = jwt.sign({ id: admin.id, username: admin.username }, SECRET)

    const user1 = await User.findOne({ where: { username: 'user1@example.com' } })
    user1Token = jwt.sign({ id: user1.id, username: user1.username }, SECRET)

    const disabledAdmin = await User.findOne({ where: { username: 'disabledadmin@admin.com' } })
    disabledAdminToken = jwt.sign({ id: disabledAdmin.id, username: disabledAdmin.username }, SECRET)
  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('GET /api/rooms', () => {
    it('admin can get all rooms', async () => {
      const res = await request(app)
        .get('/api/rooms')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(initialRooms.length)
    })
    
    it('user can get all rooms', async () => {
      const res = await request(app)
        .get('/api/rooms')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(initialRooms.length)
    })

    it('disabled admin cannot get all rooms', async () => {
      const res = await request(app)
        .get('/api/rooms')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot get all rooms', async () => {
      const res = await request(app)
        .get('/api/rooms')
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Token missing')
    })
  })

  describe('GET /api/rooms/:date', () => {
    it('admin can get all rooms for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/${third}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(initialRooms.length)
    })
  })

  describe('GET /api/rooms/:id/:date', () => {
    it('admin can get a specific room for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${tomorrow}`)
        .set('Authorization', `Bearer ${adminToken}`)
      if (dTomorrow === 6 || dTomorrow === 0) {
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Forest')
      }
    })

    it('user can get a specific room for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${tomorrow}`)
        .set('Authorization', `Bearer ${user1Token}`)
      if (dTomorrow === 6 || dTomorrow === 0) {
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Forest')
      }
    })

    it('disabled admin cannot get a specific room for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${tomorrow}`)
        .set('Authorization', `Bearer ${disabledAdminToken}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot get a specific room for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${tomorrow}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Token missing')
    })
  })

  describe('POST /api/rooms', () => {
    it('admin can create a room', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Room',
          capacity: 15,
          size: 80,
          image_path: '/images/newroom.jpeg'
        })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('New Room')
      expect(res.body.capacity).toBe(15)
      expect(res.body.size).toBe(80)
      expect(res.body.imagePath).toBe('/images/newroom.jpeg')
    })

    it('user cannot create a room', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'New Room',
          capacity: 15,
          size: 80,
          image_path: '/images/newroom.jpeg'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled admin cannot create a room', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
        .send({
          name: 'New Room',
          capacity: 15,
          size: 80,
          image_path: '/images/newroom.jpeg'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot create a room', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .send({
          name: 'New Room',
          capacity: 15,
          size: 80,
          image_path: '/images/newroom.jpeg'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Token missing')
    })

    it('signed out user cannot create a room', async () => {
      const res1 = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res1.status).toBe(204)
      
      const res2 = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Room',
          capacity: 15,
          size: 80,
          image_path: '/images/newroom.jpeg'
        })
      expect(res2.status).toBe(404)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('PUT /api/rooms/:id', () => {
    it('admin can update a room', async () => {
      const res = await request(app)
        .put('/api/rooms/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Room',
          capacity: 20,
          size: 90,
          image_path: '/images/updatedroom.jpeg'
        })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Updated Room')
    })

    it('user cannot update a room', async () => {
      const res = await request(app)
        .put('/api/rooms/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Updated Room',
          capacity: 20,
          size: 90,
          image_path: '/images/updatedroom.jpeg'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled admin cannot update a room', async () => {
      const res = await request(app)
        .put('/api/rooms/10')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
        .send({
          name: 'Updated Room',
          capacity: 20,
          size: 90,
          image_path: '/images/updatedroom.jpeg'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot update a room', async () => {
      const res = await request(app)
        .put('/api/rooms/10')
        .send({
          name: 'Updated Room',
          capacity: 20,
          size: 90,
          image_path: '/images/updatedroom.jpeg'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Token missing')
    })

    it('signed out user cannot update a room', async () => {
      const res1 = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res1.status).toBe(204)
      
      const res2 = await request(app)
        .put('/api/rooms/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Room',
          capacity: 20,
          size: 90,
          image_path: '/images/updatedroom.jpeg'
        })
      expect(res2.status).toBe(404)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('DELETE /api/rooms/:id', () => {
    it('admin can delete a room', async () => {

      const initialRoomCount = await Room.count()
      expect(initialRoomCount).toBe(2)

      const res = await request(app)
        .delete('/api/rooms/10')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedRoomCount = await Room.count()
      expect(updatedRoomCount).toBe(1)
    })

    it('user cannot delete a room', async () => {
      const res = await request(app)
        .delete('/api/rooms/10')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled admin cannot delete a room', async () => {
      const res = await request(app)
        .delete('/api/rooms/10')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot delete a room', async () => {
      const res = await request(app)
        .delete('/api/rooms/10')
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Token missing')
    })

    it('signed out user cannot delete a room', async () => {
      const res1 = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res1.status).toBe(204)
      
      const res2 = await request(app)
        .delete('/api/rooms/10')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res2.status).toBe(404)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('DELETE /api/rooms', () => {
    it('admin can delete all rooms', async () => {

      const initialRoomCount = await Room.count()
      expect(initialRoomCount).toBe(2)

      const res = await request(app)
        .delete('/api/rooms')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedRoomCount = await Room.count()
      expect(updatedRoomCount).toBe(0)
    })
  })

  describe('GET /api/rooms/:id/dates', () => {
    it('admin can get individual dates for desired room', async () => {
      const res = await request(app)
        .get('/api/rooms/10/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(1)
    })
  })

  describe('GET /api/rooms/dates', () => {
    it('admin can get all individual dates for all rooms', async () => {
      const res = await request(app)
        .get('/api/rooms/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
    })
  })
})