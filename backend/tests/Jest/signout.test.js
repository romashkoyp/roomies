const request = require('supertest')
const { app, start } = require('../../index')
const { seedDatabase, clearDatabase } = require('./seed_db')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')
const { SECRET, PORT } = require('../../util/config')

describe('Signout API', () => {
  let server
  let adminToken
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

    const disabledAdmin = await User.findOne({ where: { username: 'disabledadmin@admin.com' } })
    disabledAdminToken = jwt.sign({ id: disabledAdmin.id, username: disabledAdmin.username }, SECRET)
  })

  afterEach(async () => {
    await clearDatabase()
  })

  describe('DELETE /api/signout', () => {
    it('signed in admin can sign out', async () => {
      const res = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(204)
    })

    it('disabled admin cannot signout', async () => {
      const res = await request(app)
        .delete('/api/signout')
        .set('Authorization', `Bearer ${disabledAdminToken}`)
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Account disabled')
    })
  })
})