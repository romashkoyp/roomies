const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase, initialRooms } = require('./seed_db')
const { User, Room, IndividualDate } = require('../../models')
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
    second = dayData.second
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

  describe('GET     /', () => {
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
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot get all rooms', async () => {
      const res = await request(app)
        .get('/api/rooms')
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Token missing')
    })
  })

  describe('POST    /', () => {
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
      expect(res.status).toBe(400)
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
      expect(res.status).toBe(400)
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
      expect(res.status).toBe(400)
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
      expect(res2.status).toBe(400)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('DELETE  /', () => {
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

  describe('GET     /dates', () => {
    it('admin can get all individual dates for all rooms', async () => {
      const res = await request(app)
        .get('/api/rooms/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
    })
  })

  describe('DELETE  /dates', () => {
    it('admin can delete all dates for all rooms', async () => {

      const initialDateCount = await IndividualDate.count()
      expect(initialDateCount).toBe(2)
      console.log(initialDateCount)

      const res = await request(app)
        .delete('/api/rooms/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedDateCount = await IndividualDate.count()
      expect(updatedDateCount).toBe(0)
      console.log(updatedDateCount)
    })
  })

  describe('PUT     /:id', () => {
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
      expect(res.body.capacity).toBe(20)
      expect(res.body.size).toBe(90)
      expect(res.body.imagePath).toBe('/images/updatedroom.jpeg')
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
      expect(res.status).toBe(400)
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
      expect(res.status).toBe(400)
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
      expect(res.status).toBe(400)
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
      expect(res2.status).toBe(400)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('DELETE  /:id', () => {
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
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled admin cannot delete a room', async () => {
      const res = await request(app)
        .delete('/api/rooms/10')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot delete a room', async () => {
      const res = await request(app)
        .delete('/api/rooms/10')
      expect(res.status).toBe(400)
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
      expect(res2.status).toBe(400)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('GET     /:id/dates', () => {
    it('admin can get individual dates for desired room', async () => {
      const res = await request(app)
        .get('/api/rooms/10/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(1)
    })
  })

  describe('POST    /:id/dates', () => {
    it('admin can create new date for room (availability is false)', async () => {
      const res = await request(app)
        .post('/api/rooms/20/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Short work day',
          date: `${second}`,
          availability: false
        })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Short work day')
      expect(res.body.date).toBe(`${second}`)
      expect(res.body.availability).toBe(false)
      expect(res.body.timeBegin).toBe(null)
      expect(res.body.timeEnd).toBe(null)
      expect(res.body.dayOfWeek).toBe(dSecond)
      expect(res.body.roomId).toBe(20)
    })

    it('admin can create new date for room (availability is true)', async () => {
      const res = await request(app)
        .post('/api/rooms/20/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Short work day',
          date: `${second}`,
          availability: true,
          time_begin: '12:00',
          time_end: '14:00'
        })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Short work day')
      expect(res.body.date).toBe(`${second}`)
      expect(res.body.availability).toBe(true)
      expect(res.body.timeBegin).toBe('12:00:00')
      expect(res.body.timeEnd).toBe('14:00:00')
      expect(res.body.dayOfWeek).toBe(dSecond)
      expect(res.body.roomId).toBe(20)
    })
    
    it('admin cannot create new date for room without name', async () => {
      const res = await request(app)
        .post('/api/rooms/20/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: undefined,
          date: undefined,
          availability: undefined,
          time_begin: undefined,
          time_end: undefined
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Name required')
    })

    it('admin cannot create new date for room with wrong date', async () => {
      const res = await request(app)
        .post('/api/rooms/20/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test name',
          date: 'random text',
          availability: undefined,
          time_begin: undefined,
          time_end: undefined
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[1].msg).toBe('Date must be in YYYY-MM-DD format')
    })

    it('admin cannot create new date for room when bad time', async () => {
      const res = await request(app)
        .post('/api/rooms/20/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Short work day',
          date: `${second}`,
          availability: true,
          time_begin: '14:00',
          time_end: '14:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Time begin (request) must be before time end (request)')
    })

    it('admin cannot create new date for room when date is already exists', async () => {
      const res = await request(app)
        .post('/api/rooms/20/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Short work day',
          date: `${tomorrow}`,
          availability: true,
          time_begin: '12:00',
          time_end: '14:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Settings for the room on current date already exist. Delete previous settings.')
    })
  })

  describe('DELETE   /:id/dates', () => {
    it('admin can delete all dates for desired room', async () => {

      const initialDateCount = await IndividualDate.count({ where: { roomId: 20 } })
      expect(initialDateCount).toBe(1)

      const res = await request(app)
        .delete('/api/rooms/20/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedDateCount = await IndividualDate.count({ where: { roomId: 20 } })
      expect(updatedDateCount).toBe(0)

      const dateCountAnotherRoom = await IndividualDate.count({ where: { roomId: 10 } })
      expect(dateCountAnotherRoom).toBe(1)
    })
  })

  describe('GET     /:date', () => {
    it('admin can get all rooms for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/${third}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(initialRooms.length)
    })
  })

  describe('GET     /:id/:date', () => {
    it('admin can get a specific room for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${third}`)
        .set('Authorization', `Bearer ${adminToken}`)
      if (dThird === 6 || dThird=== 0) {
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Forest')
      }
    })

    it('user can get a specific room for desired date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${third}`)
        .set('Authorization', `Bearer ${user1Token}`)
      if (dThird === 6 || dThird === 0) {
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Forest')
      }
    })

    it('disabled admin cannot get a specific room for individual date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${third}`)
        .set('Authorization', `Bearer ${disabledAdminToken}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot get a specific room for individual date', async () => {
      const res = await request(app)
        .get(`/api/rooms/20/${third}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Token missing')
    })
  })

  describe('DELETE   /:id/:date"', () => {
    it('admin can delete desired date for desired room', async () => {

      const initialDateCount = await IndividualDate.count({ where: { roomId: 20 } })
      expect(initialDateCount).toBe(1)

      const res = await request(app)
        .delete(`/api/rooms/20/${tomorrow}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedDateCount = await IndividualDate.count({ where: { roomId: 20 } })
      expect(updatedDateCount).toBe(0)

      const dateCountAnotherRoom = await IndividualDate.count({ where: { roomId: 10 } })
      expect(dateCountAnotherRoom).toBe(1)
    })
  })
})