const request = require('supertest')
const app = require('../../index')
const { seedDatabase, clearDatabase, initialUsers } = require('./seed_db')

describe('Users API', () => {
  let server

  beforeAll(async () => {
    server = app.listen()
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
  
  describe('GET /api/users', () => {
    it('should return all users without passwordHash', async () => {
      const agent = request.agent(app)
      const response = await agent.get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(initialUsers.length) 
      response.body.forEach((user) => {
        expect(user).not.toHaveProperty('passwordHash')
      })
    })
  })
})