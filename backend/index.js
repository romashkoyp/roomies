const express = require('express')
require('express-async-errors')
const app = express()

const { PORT, ADMIN_USERNAME, ADMIN_PASSWORD, SEED_ADMIN_USER } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { passwordHash } = require('./util/middleware')
const { User } = require('./models')

const notificationRouter = require('./controllers/notifications')
const userRouter = require('./controllers/users')
const signinRouter = require('./controllers/signin')
const signupRouter = require('./controllers/signup')

const { errorHandler } = require('./util/middleware')

app.use(express.json())

app.use('/api/notifications', notificationRouter)
app.use('/api/users', userRouter)
app.use('/api/signin', signinRouter)
app.use('/api/signup', signupRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()

  console.log('Status of creating admin user:', SEED_ADMIN_USER)

  if (SEED_ADMIN_USER === true) {
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
      console.log('Admin already exist in database!')
    }
  } else {
    console.log('Admin user not created!')
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

module.exports = app