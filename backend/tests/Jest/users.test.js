const request = require('supertest')
const app = require('../../index')
const { seedDatabase, clearDatabase, initialUsers } = require('./seed_db')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../../util/config')

describe('Users API', () => {
  let adminToken
  let user1Token
  let user3Token

  beforeEach(async () => {
    await seedDatabase()

    const admin = await User.findOne({ where: { username: 'testadmin@admin.com' } })
    adminToken = jwt.sign({ id: admin.id, username: admin.username }, SECRET)

    const user1 = await User.findOne({ where: { username: 'user1@example.com' } })
    user1Token = jwt.sign({ id: user1.id, username: user1.username }, SECRET)

    const user3 = await User.findOne({ where: { username: 'user3@example.com' } })
    user3Token = jwt.sign({ id: user3.id, username: user3.username }, SECRET)
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

    it('disabled user cannot get list of other users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${user3Token}`)
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })

    it('returns 401 if no token is provided', async () => {
      const res = await request(app)
        .get('/api/users')
      expect(res.status).toBe(401)
      expect(res.body.error).toBe('token missing')
    })
  })
})