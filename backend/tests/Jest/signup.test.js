const request = require('supertest')
const app = require('../../index')
const { seedDatabase, clearDatabase } = require('./seed_db')

describe('Signup API', () => {
  beforeEach(async () => {
    await seedDatabase()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('POST /api/signup', () => {
    it('should successfully sign up a new user', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'New User',
          username: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        })
      console.log(res.body)
      expect(res.status).toBe(201)
      expect(res.body.username).toBe('newuser@example.com')
      expect(res.body.name).toBe('New User')
    })

    it('should fail if name is empty', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: '',
          username: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Name is required')
    })

    it('should fail if username is empty', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'New User',
          username: '',
          password: 'password123',
          confirmPassword: 'password123'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Username is required')
    })

    it('should fail if username is not an email', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'New User',
          username: 'newuser',
          password: 'password123',
          confirmPassword: 'password123'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Invalid email format')
    })

    it('should fail if password is empty', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'New User',
          username: 'newuser@example.com',
          password: '',
          confirmPassword: ''
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Password is required')
    })

    it('should fail if password is too short', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'New User',
          username: 'newuser@example.com',
          password: 'pass',
          confirmPassword: 'pass'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Password must be at least 8 characters long')
    })

    it('should fail if passwords do not match', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'New User',
          username: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password1234'
        })
      expect(res.status).toBe(400)
      expect(res.body.errors[0].msg).toBe('Passwords do not match')
    })
  })
})