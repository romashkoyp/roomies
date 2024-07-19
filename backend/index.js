const express = require('express')
require('express-async-errors')
const app = express()

const { PORT, TEST } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { createAdminUser } = require('./util/adminCreator')

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

  console.log('Status of test mode:', TEST)

  if (TEST === false) {
    await createAdminUser()
  } else {
    console.log('Admin user not created!')
  }
}

if (TEST === false) {
  start().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
}

module.exports = { app, start }