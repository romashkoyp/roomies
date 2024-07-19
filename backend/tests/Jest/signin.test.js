const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase } = require('./seed_db')
const { PORT } = require('../../util/config')

describe('Signup API', () => {
  let server

  beforeAll(async () => {
    await start()
    server = app.listen(PORT)
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await seedDatabase()
  })
  
  afterEach(async () => {
    await clearDatabase()
  })

  describe('POST /api/signin', () => {
    it('successful log in', async () => {
      const res = await request(app)
        .post('/api/signin')
        .send({
          username: 'user1@example.com',
          password: 'pdCh8,$r',
        })
      expect(res.status).toBe(200)
    })

    it('empty username forbidden', async () => {
      const res = await request(app)
        .post('/api/signin')
        .send({
          username: '',
          password: 'pdCh8,$r',
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Username is required')
    })

    it('incorrect username forbidden', async () => {
      const res = await request(app)
        .post('/api/signin')
        .send({
          username: 'user1example.com',
          password: 'pdCh8,$r',
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Invalid email format')
    })

    it('empty password forbidden', async () => {
      const res = await request(app)
        .post('/api/signin')
        .send({
          username: 'user1@example.com',
          password: '',
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Password is required')
    })

    it('invalid password forbidden', async () => {
      const res = await request(app)
        .post('/api/signin')
        .send({
          username: 'user1@example.com',
          password: 'dfbfgbfgbfdgb'
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Invalid username or password')
    })

    it('disabled admin cannot signin', async () => {
      const res = await request(app)
        .post('/api/signin')
        .send({
          username: 'disabledadmin@admin.com',
          password: 'pdr,Ch8$',
        })
      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Account disabled')
    })
  })
})