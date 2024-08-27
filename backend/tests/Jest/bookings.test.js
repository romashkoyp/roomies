const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase } = require('./seed_db')
const { User, Booking } = require('../../models')
const jwt = require('jsonwebtoken')
const { SECRET, PORT } = require('../../util/config')
const { dayCreator } = require('../Jest/dayCreator')

describe('Bookings API', () => {
  let server
  let adminToken
  let user1Token
  let user4Token

  let tomorrow
  let dTomorrow

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

    const user4 = await User.findOne({ where: { username: 'user4@example.com' } })
    user4Token = jwt.sign({ id: user4.id, username: user4.username }, SECRET)
  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('GET     /', () => {
    it('admin can get all bookings for all rooms', async () => {
      const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
    })

    it('user can get all bookings for all rooms', async () => {
      const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${user1Token}`)
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
    })
  })

  describe('POST    /', () => {
    it('admin can make a booking for desired room on desired date', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Booking by admin',
        date: third,
        time_begin: '10:00',
        time_end: '11:00',
        room_id: 20
      })

      if (dThird === 6 || dThird === 0) {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Booking by admin')
        expect(res.body.date).toBe(third)
        expect(res.body.enabled).toBe(true)
        expect(res.body.timeBegin).toBe('10:00:00')
        expect(res.body.timeEnd).toBe('11:00:00')
        expect(res.body.roomId).toBe(20)
        expect(res.body.userId).toBe(10)
      }
    })

    it('user can make a booking for desired room on desired date', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Booking by User 1',
        date: third,
        time_begin: '10:00',
        time_end: '11:00',
        room_id: 20
      })

      if (dThird === 6 || dThird === 0) {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Booking by User 1')
        expect(res.body.date).toBe(third)
        expect(res.body.enabled).toBe(true)
        expect(res.body.timeBegin).toBe('10:00:00')
        expect(res.body.timeEnd).toBe('11:00:00')
        expect(res.body.roomId).toBe(20)
        expect(res.body.userId).toBe(10)
      }
    })

    it('user can make a booking for desired room on individual date', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user4Token}`)
      .send({
        name: 'Booking by User 4',
        date: tomorrow,
        time_begin: '11:00',
        time_end: '12:00',
        room_id: 10
      })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Booking by User 4')
      expect(res.body.date).toBe(tomorrow)
      expect(res.body.enabled).toBe(true)
      expect(res.body.timeBegin).toBe('11:00:00')
      expect(res.body.timeEnd).toBe('12:00:00')
      expect(res.body.roomId).toBe(10)
      expect(res.body.userId).toBe(60)
    })

    it('user cannot make a booking for desired room because it is not available', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user4Token}`)
      .send({
        name: 'Booking by User 4',
        date: second,
        time_begin: '11:00',
        time_end: '12:00',
        room_id: 10
      })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Room not available on this date')
    })

    it('user cannot make a booking for desired room because time is out of room\'s schedule', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user4Token}`)
      .send({
        name: 'Booking by User 4',
        date: tomorrow,
        time_begin: '09:00',
        time_end: '10:00',
        room_id: 10
      })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Booking time is outside the room\'s available hours')
    })

    it('user cannot make a booking for desired room because it overlapping with others bookings (1)', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user4Token}`)
      .send({
        name: 'Booking by User 4',
        date: tomorrow,
        time_begin: '10:00',
        time_end: '12:00',
        room_id: 10
      })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Time slot is already booked')
    })

    it('user cannot make a booking for desired room because it overlapping with others bookings (2)', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user4Token}`)
      .send({
        name: 'Booking by User 4',
        date: tomorrow,
        time_begin: '11:00',
        time_end: '13:00',
        room_id: 10
      })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Time slot is already booked')
    })

    it('user cannot make a booking for desired room because it overlapping with others bookings (3)', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user4Token}`)
      .send({
        name: 'Booking by User 4',
        date: tomorrow,
        time_begin: '10:00',
        time_end: '13:00',
        room_id: 10
      })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Time slot is already booked')
    })

    it('user cannot make a booking for desired room without requested data', async () => {
      const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${user4Token}`)
      .send({
        name: null,
        date: null,
        time_begin: null,
        time_end: null,
        room_id: null
      })
      expect(res.status).toBe(400)
      expect(res.body.errors).toEqual([
          {
            type: 'field',
            value: null,
            msg: 'Name is required',
            path: 'name',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Date is required',
            path: 'date',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Invalid value',
            path: 'date',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Date must be in YYYY-MM-DD format',
            path: 'date',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Date must be today or a future date',
            path: 'date',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Room ID is required',
            path: 'room_id',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Room ID must be an integer',
            path: 'room_id',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Beginning time is required',
            path: 'time_begin',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Beginning time must be in HH:MM format',
            path: 'time_begin',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Ending time is required',
            path: 'time_end',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Ending time must be in HH:MM format',
            path: 'time_end',
            location: 'body'
          },
          {
            type: 'field',
            value: null,
            msg: 'Time begin (request) must be before time end (request)',
            path: 'time_begin',
            location: 'body'
          }
        ]
      )
    })
  })

  describe('GET     /:id', () => {
    it('admin can get desired booking', async () => {
      const res = await request(app)
        .get('/api/bookings/10')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(10)
      expect(res.body.userId).toBe(20)
      expect(res.body.roomId).toBe(10)
      expect(res.body.name).toBe('New booking by User 1')
      expect(res.body.date).toBe(tomorrow)
      expect(res.body.timeBegin).toBe('10:00:00')
      expect(res.body.timeEnd).toBe('11:00:00')
    })

    it('user can get desired booking', async () => {
      const res = await request(app)
        .get('/api/bookings/10')
        .set('Authorization', `Bearer ${user4Token}`)
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(10)
      expect(res.body.userId).toBe(20)
      expect(res.body.roomId).toBe(10)
      expect(res.body.name).toBe('New booking by User 1')
      expect(res.body.date).toBe(tomorrow)
      expect(res.body.timeBegin).toBe('10:00:00')
      expect(res.body.timeEnd).toBe('11:00:00')
    })
  })

  describe('PUT     /:id', () => {
    it('admin can change user\'s booking time', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Changed user\'s booking by admin',
          time_begin: '11:00',
          time_end: '12:00'
        })
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(10)
      expect(res.body.name).toBe('Changed user\'s booking by admin')
      expect(res.body.enabled).toBe(true)
      expect(res.body.date).toBe(tomorrow)
      expect(res.body.timeBegin).toBe('11:00')
      expect(res.body.timeEnd).toBe('12:00')
      expect(res.body.roomId).toBe(10)
      expect(res.body.userId).toBe(20)
    })

    it('user can change own booking\'s time', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Changed user\'s booking by this user',
          time_begin: '11:00',
          time_end: '12:00'
        })
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(10)
      expect(res.body.name).toBe('Changed user\'s booking by this user')
      expect(res.body.enabled).toBe(true)
      expect(res.body.date).toBe(tomorrow)
      expect(res.body.timeBegin).toBe('11:00')
      expect(res.body.timeEnd).toBe('12:00')
      expect(res.body.roomId).toBe(10)
      expect(res.body.userId).toBe(20)
    })

    it('user can change own booking\'s status', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          enabled: false
        })
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(10)
      expect(res.body.name).toBe('New booking by User 1')
      expect(res.body.enabled).toBe(false)
      expect(res.body.date).toBe(tomorrow)
      expect(res.body.timeBegin).toBe('10:00:00')
      expect(res.body.timeEnd).toBe('11:00:00')
      expect(res.body.roomId).toBe(10)
      expect(res.body.userId).toBe(20)
    })

    it('user can change own booking\'s date', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: third
        })
      if (dThird === 6 || dThird === 0) {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(10)
        expect(res.body.name).toBe('New booking by User 1')
        expect(res.body.enabled).toBe(true)
        expect(res.body.date).toBe(third)
        expect(res.body.timeBegin).toBe('10:00:00')
        expect(res.body.timeEnd).toBe('11:00:00')
        expect(res.body.roomId).toBe(10)
        expect(res.body.userId).toBe(20)
      }
    })

    it('user can change own booking\'s date and time', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: third,
          time_begin: '11:00',
          time_end: '12:00'
        })
      if (dThird === 6 || dThird === 0) {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Room not available on this date')
      } else {
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(10)
        expect(res.body.name).toBe('New booking by User 1')
        expect(res.body.enabled).toBe(true)
        expect(res.body.date).toBe(third)
        expect(res.body.timeBegin).toBe('11:00')
        expect(res.body.timeEnd).toBe('12:00')
        expect(res.body.roomId).toBe(10)
        expect(res.body.userId).toBe(20)
      }
    })

    it('user cannot change other\'s booking', async () => {
      const res = await request(app)
        .put('/api/bookings/20')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'new name'
        })
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Not enough rights')
    })

    it('user cannot change own booking\'s date when room is not available', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: second
        })
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Room not available on this date')
    })

    it('user cannot change own booking\'s time when beginning time is out of room\'s schedule', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          time_begin: '09:00'
        })
        expect(res.status).toBe(400)
        expect(res.body.errors).toEqual([
          {
            type: 'field',
            value: '09:00',
            msg: "Booking beginning time is outside the room's available hours",
            path: 'time_begin',
            location: 'body'
          }
        ])
    })

    it('user cannot change own booking\'s time when ending time is out of room\'s schedule', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          time_begin: '14:00',
          time_end: '15:00'
        })
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Booking time is outside the room\'s available hours')
    })

    it('user cannot change own booking\'s time when overlapping with others bookings', async () => {
      const res = await request(app)
        .put('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          time_begin: '11:00',
          time_end: '13:00'
        })
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Time slot is already booked')
    })
  })

  describe('DELETE     /:id', () => {
    it('admin can delete user\'s booking', async () => {

      const initialBookingCount = await Booking.count()
      expect(initialBookingCount).toBe(2)

      const res = await request(app)
        .delete('/api/bookings/10')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedBookingCount = await Booking.count()
      expect(updatedBookingCount).toBe(1)
    })

    it('user can delete own booking', async () => {

      const initialBookingCount = await Booking.count()
      expect(initialBookingCount).toBe(2)

      const res = await request(app)
        .delete('/api/bookings/10')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(204)

      const updatedBookingCount = await Booking.count()
      expect(updatedBookingCount).toBe(1)
    })

    it('user cannot delete others\' booking', async () => {

      const initialBookingCount = await Booking.count()
      expect(initialBookingCount).toBe(2)

      const res = await request(app)
        .delete('/api/bookings/20')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')

      const updatedBookingCount = await Booking.count()
      expect(updatedBookingCount).toBe(2)
    })
  })
}) 