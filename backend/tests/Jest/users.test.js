const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase, initialUsers } = require('./seed_db')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')
const { SECRET, PORT } = require('../../util/config')

describe('Users API', () => {
  let server
  let adminToken
  let user1Token
  let user2Token
  let user3Token
  let user4Token

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

    const user4 = await User.findOne({ where: { username: 'user4@example.com' } })
    user4Token = jwt.sign({ id: user4.id, username: user4.username }, SECRET)
  })

  afterEach(async () => {
    await clearDatabase()
  })
  
  describe('GET /api/users', () => {
    it('admin can get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(initialUsers.length)
    })

    it('common user cannot get list of other users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled user cannot get list of other users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${user3Token}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('returns 401 if no token provided', async () => {
      const res = await request(app)
        .get('/api/users')
      expect(res.status).toBe(401)
      expect(res.body.error).toBe('token missing')
    })
  })

  describe('GET /api/users/:id', () => {
    it('admin can get desired user without passwordHash', async () => {
      const res = await request(app)
        .get('/api/users/20')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.username).toBe('user1@example.com')
      expect(res.body.passwordHash).toBeUndefined()
    })

    it('user can get own data without passwordHash', async () => {
      const res = await request(app)
        .get('/api/users/20')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(200)
      expect(res.body.username).toBe('user1@example.com')
      expect(res.body.passwordHash).toBeUndefined()
    })

    it('user cannot get data of other user', async () => {
      const res = await request(app)
        .get('/api/users/30')
        .set('Authorization', `Bearer ${user1Token}`)
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Not enough rights')
    })

    it('disabled user cannot get his own data', async () => {
      const res = await request(app)
        .get('/api/users/40')
        .set('Authorization', `Bearer ${user3Token}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('nonexisting user cannot be reached', async () => {
      const res = await request(app)
        .get('/api/users/999999')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('User not found')
    })

    it('signed out user cannot get his own data', async () => {
      const res1 = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${user4Token}`)
      expect(res1.status).toBe(204)

      const res2 = await request(app)
        .get('/api/users/60')
        .set('Authorization', `Bearer ${user4Token}`)
      expect(res2.status).toBe(404)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('PUT /api/users/:id', () => {
    it('admin can change all user\'s data', async () => {
      const res = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'updated name by admin',
          username: 'new@username.com',
          admin: true,
          enabled: false
         })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('updated name by admin')
      expect(res.body.username).toBe('new@username.com')
      expect(res.body.admin).toBe(true)
      expect(res.body.enabled).toBe(false)
    })

    it('user can change own name and username', async () => {
      const res = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'updated name by user',
          username: 'new@username.com'
        })
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('updated name by user')
      expect(res.body.username).toBe('new@username.com')
    })

    it('user cannot change admin and enabled status', async () => {
      const res = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ admin: true, enabled: false })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('validation email for non emails as username', async () => {
      const res = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          username: 'newusername.com'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Invalid email format')
    })

    it('validation admin field for non boolean value', async () => {
      const res = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          admin: 'string'
        })
      console.log(res.body)
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Allowed True or False for admin status')
    })

    it('validation enabled field for non boolean value', async () => {
      const res = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          enabled: 'string'
        })
      console.log(res.body)
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Allowed True or False for enabled status')
    })

    it('signed out user cannot change own data', async () => {
      const res1 = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res1.status).toBe(204)

      const res2 = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'updated name by user',
          username: 'new@username.com'
        })
      expect(res2.status).toBe(404)
      expect(res2.body.error).toBe('Session not found')
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('admin can delete users account', async () => {
      const res = await request(app)
        .delete('/api/users/40')
        .set('Authorization', `Bearer ${adminToken}`)
      console.log(res.body)
      expect(res.status).toBe(204)
    })

    it('user can delete own account', async () => {
      const res = await request(app)
        .delete('/api/users/20')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res.status).toBe(204)
    })

    it('user cannot delete another account', async () => {
      const res = await request(app)
        .delete('/api/users/20')
        .set('Authorization', `Bearer ${user2Token}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Not enough rights')
    })

    it('signed out user cannot delete own data', async () => {
      const res1 = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res1.status).toBe(204)

      const res2 = await request(app)
        .delete('/api/users/20')
        .set('Authorization', `Bearer ${user1Token}`)
      expect(res2.status).toBe(404)
      expect(res2.body.error).toBe('Session not found')
    })
  })
})