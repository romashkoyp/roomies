const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase, initialNotifications } = require('./seed_db')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')
const { SECRET, PORT } = require('../../util/config')

describe('Notifications API', () => {
  let server
  let adminToken
  let user1Token
  let user2Token
  let user3Token
  let disabledAdminToken
  
  beforeAll(async () => {
    await start()
    server = app.listen(PORT)
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

    const user2 = await User.findOne({ where: { username: 'user2@example.com' } })
    user2Token = jwt.sign({ id: user2.id, username: user2.username }, SECRET)

    const user3 = await User.findOne({ where: { username: 'user3@example.com' } })
    user3Token = jwt.sign({ id: user3.id, username: user3.username }, SECRET)

    const disabledAdmin = await User.findOne({ where: { username: 'disabledadmin@admin.com' } })
    disabledAdminToken = jwt.sign({ id: disabledAdmin.id, username: disabledAdmin.username }, SECRET)
  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('GET /api/notifications', () => {
    it('any user can get all notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(initialNotifications.length)
    })

    it('any user can get desired notification', async () => {
      const res = await request(app)
        .get('/api/notifications/10')
      expect(res.status).toBe(200)
      expect(res.body.content).toBe('Test notification 1')
    })
  })

  describe('POST /api/notifications', () => {
    it('admin can create notification', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          content: 'test content by admin'
        })
      expect(res.status).toBe(201)
      expect(res.body.content).toBe('test content by admin')
    })

    it('user cannot create notification', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          content: 'test content by user'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled admin cannot create notification', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
        .send({
          content: 'test content by disabled admin'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('content of notification cannot be empty', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Content is required')
    })

    it('nonregistered user cannot create notification', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .send({
          content: 'test content by disabled admin'
        })
      expect(res.status).toBe(401)
      expect(res.body.error).toBe('token missing')
    })
  })

  describe('PUT /api/notifications/:id', () => {
    it('admin can change notification', async () => {
      const res = await request(app)
        .put('/api/notifications/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          content: 'changed notification'
        })
      expect(res.status).toBe(200)
      expect(res.body.content).toBe('changed notification')
    })

    it('notification cannot be empty', async () => {
      const res = await request(app)
        .put('/api/notifications/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Content is required')
    })

    it('user cannot change notification', async () => {
      const res = await request(app)
        .put('/api/notifications/10')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          content: 'test content by user'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled admin cannot change notification', async () => {
      const res = await request(app)
        .put('/api/notifications/10')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
        .send({
          content: 'test content by disabled admin'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })
    
    it('nonregistered user cannot change notification', async () => {
      const res = await request(app)
        .put('/api/notifications/10')
        .send({
          content: 'test content'
        })
      expect(res.status).toBe(401)
      expect(res.body.error).toBe('token missing')
    })
  })

  describe('DELETE /api/notifications/:id', () => {
    it('admin can delete notification', async () => {
      const res = await request(app)
        .delete('/api/notifications/10')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)
    })

    it('user cannot delete notification', async () => {
      const res = await request(app)
        .delete('/api/notifications/10')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled admin cannot delete notification', async () => {
      const res = await request(app)
        .delete('/api/notifications/10')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonregistered user cannot delete notification', async () => {
      const res = await request(app)
        .delete('/api/notifications/10')
      expect(res.status).toBe(401)
      expect(res.body.error).toBe('token missing')
    })
  })
})