const { User } = require('../models')
const { passwordHash } = require('../util/middleware')
const { ADMIN_USERNAME, ADMIN_PASSWORD } = require('../util/config')

const createAdminUser = async () => {
  const existingAdmin = await User.findOne({ where: { username: ADMIN_USERNAME } })
  if (!existingAdmin) {
    const hashedPassword = await passwordHash(ADMIN_PASSWORD)
    await User.create({
      username: ADMIN_USERNAME,
      name: 'admin',
      passwordHash: hashedPassword,
      admin: true,
      enabled: true,
    })
    console.log('Admin user created!')
  } else {
    console.log('Admin already exists in database!')
  }
}

module.exports = { createAdminUser }