const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase, initialGlobalWeekdays } = require('./seed_db')
const { User, GlobalWeekday, GlobalDate } = require('../../models')
const jwt = require('jsonwebtoken')
const { SECRET, PORT } = require('../../util/config')
const { dayCreator } = require('../Jest/dayCreator')

describe('Settings API', () => {
  let server
  let adminToken
  let user1Token

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

  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('GET     /weekdays', () => {
    it('admin can get global settings for weekdays', async () => {
      const res = await request(app)
        .get('/api/settings/weekdays')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(initialGlobalWeekdays.length)
    })

    it('user cannot get global settings for weekdays', async () => {
      const res = await request(app)
        .get('/api/settings/weekdays')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('PUT     /weekdays', () => {
    it('admin can update all weekdays settings', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(201)
      expect(res.body.length).toBe(7)
      res.body.forEach(weekday => {
        expect(weekday.availability).toBe(true)
        expect(weekday.timeBegin).toBe('09:00')
        expect(weekday.timeEnd).toBe('17:00')
      })
    })

    it('user cannot update all weekdays settings', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('validation errors for invalid data', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          availability: true,
          time_begin: '09:00',
          time_end: '09:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Time begin (request) must be before time end (request)')
    })
  })

  describe('DELETE  /weekdays', () => {
    it('admin can restore global settings for weekdays', async () => {

      const initialWeekdayCount = await GlobalWeekday.count()
      expect(initialWeekdayCount).toBe(7)

      const res = await request(app)
        .delete('/api/settings/weekdays')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedWeekdayCount = await GlobalWeekday.count()
      expect(updatedWeekdayCount).toBe(7)
    })

    it('user cannot restore global settings for weekdays', async () => {
      const res = await request(app)
        .delete('/api/settings/weekdays')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('GET     /weekdays/:dayOfWeek', () => {
    it('admin can get settings for a specific weekday', async () => {
      const res = await request(app)
        .get('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.dayOfWeek).toBe(1)
      expect(res.body.availability).toBe(true)
      expect(res.body.timeBegin).toBe('08:00:00')
      expect(res.body.timeEnd).toBe('16:00:00')
    })

    it('user cannot get settings for a specific weekday', async () => {
      const res = await request(app)
        .get('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('PUT     /weekdays/:dayOfWeek', () => {
    it('admin can update settings for a specific weekday', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(201)
      expect(res.body.dayOfWeek).toBe(1)
      expect(res.body.availability).toBe(true)
      expect(res.body.timeBegin).toBe('09:00')
      expect(res.body.timeEnd).toBe('17:00')
    })

    it('user cannot update settings for a specific weekday', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('admin cannot update settings with missing availability', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Availability is required')
    })

    it('admin cannot update settings with invalid time_begin format', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          availability: true,
          time_begin: 'wrong time',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Begin time must be in HH:MM format')
    })

    it('admin cannot update settings with invalid time_end format', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          availability: true,
          time_begin: '09:00',
          time_end: '17:0'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Ending time must be in HH:MM format')
    })

    it('admin cannot update settings with time_begin after time_end', async () => {
      const res = await request(app)
        .put('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          availability: true,
          time_begin: '17:00',
          time_end: '09:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Time begin (request) must be before time end (request)')
    })
  })

  describe('DELETE  /weekdays/:dayOfWeek', () => {
    it('admin can restore global settings for desired weekday', async () => {

      const initialWeekdayCount = await GlobalWeekday.count()
      expect(initialWeekdayCount).toBe(7)

      const res = await request(app)
        .delete('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedWeekdayCount = await GlobalWeekday.count()
      expect(updatedWeekdayCount).toBe(7)

      const restoredWeekday = await GlobalWeekday.findOne({ where: { dayOfWeek: 1, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' } })
      expect(restoredWeekday)
    })

    it('user cannot delete settings for a specific weekday', async () => {
      const res = await request(app)
        .delete('/api/settings/weekdays/1')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('GET     /dates', () => {
    it('admin can get global settings for dates', async () => {
      const res = await request(app)
        .get('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
    })

    it('user cannot get global settings for dates', async () => {
      const res = await request(app)
        .get('/api/settings/dates')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('POST    /dates', () => {
    it('admin can create new global date settings', async () => {
      const res = await request(app)
        .post('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Global Date',
          date: third,
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('New Global Date')
      expect(res.body.date).toBe(third)
      expect(res.body.availability).toBe(true)
      expect(res.body.timeBegin).toBe('09:00:00')
      expect(res.body.timeEnd).toBe('17:00:00')
      expect(res.body.dayOfWeek).toBe(dThird)
    })

    it('admin cannot create new global date settings for existing date', async () => {
      const res = await request(app)
        .post('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Global Date',
          date: tomorrow,
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('date must be unique')
    })

    it('admin cannot create new global date settings with missing required fields', async () => {
      const res = await request(app)
        .post('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          date: third,
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Name required')
    })

    it('admin cannot create new global date settings with invalid date format', async () => {
      const res = await request(app)
        .post('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Global Date',
          date: 'invalid-date',
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[1].msg).toBe('Date must be in YYYY-MM-DD format')
    })

    it('admin cannot create new global date settings with invalid time format', async () => {
      const res = await request(app)
        .post('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Global Date',
          date: third,
          availability: true,
          time_begin: 'time begin',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Begin time must be in HH:MM format')
    })

    it('admin cannot create new global date settings with wrong time', async () => {
      const res = await request(app)
        .post('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Global Date',
          date: third,
          availability: true,
          time_begin: '09:00',
          time_end: '09:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Time begin (request) must be before time end (request)')
    })

    it('user cannot create new global date settings', async () => {
      const res = await request(app)
        .post('/api/settings/dates')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'New Global Date',
          date: third,
          availability: true,
          time_begin: '09:00',
          time_end: '17:00'
        })
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('DELETE  /dates', () => {
    it('admin can delete global dates', async () => {

      const initialDayCount = await GlobalDate.count()
      expect(initialDayCount).toBe(2)

      const res = await request(app)
        .delete('/api/settings/dates')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedDatesCount = await GlobalDate.count()
      expect(updatedDatesCount).toBe(0)
    })

    it('user cannot delete global dates', async () => {
      const res = await request(app)
        .delete('/api/settings/dates')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('GET     /weekdays/:dayOfWeek', () => {
    it('admin can get date', async () => {
      const res = await request(app)
        .get(`/api/settings/dates/${tomorrow}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Global Holiday')
      expect(res.body.dayOfWeek).toBe(dTomorrow)
      expect(res.body.availability).toBe(false)
      expect(res.body.timeBegin).toBe(null)
      expect(res.body.timeEnd).toBe(null)
    })

    it('user cannot get day', async () => {
      const res = await request(app)
        .get(`/api/settings/dates/${tomorrow}`)
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })

  describe('DELETE  /dates/:date', () => {
    it('admin can delete global date', async () => {

      const initialDateCount = await GlobalDate.count()
      expect(initialDateCount).toBe(2)

      const res = await request(app)
        .delete(`/api/settings/dates/${tomorrow}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)

      const updatedDateCount = await GlobalDate.count()
      expect(updatedDateCount).toBe(1)
    })

    it('user cannot delete global date', async () => {
      const res = await request(app)
        .delete(`/api/settings/dates/${tomorrow}`)
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Not enough rights')
    })
  })
})