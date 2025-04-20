const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const { PORT, TEST, DEV, PROD } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { createAdminUser } = require('./util/adminCreator')
const { createGlobalRoomsWeekdays } = require('./util/globalRoomsWeekdaysCreator')

const notificationRouter = require('./controllers/notifications')
const userRouter = require('./controllers/users')
const signinRouter = require('./controllers/signin')
const signupRouter = require('./controllers/signup')
const signoutRouter = require('./controllers/signout')
const roomRouter = require('./controllers/rooms')
const bookingRouter = require('./controllers/bookings')
const settingRouter = require('./controllers/settings')

const { errorHandler } = require('./util/middleware')
const { createRooms } = require('./util/roomsCreator')
const { createMessages } = require('./util/messagesCreator')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/notifications', notificationRouter)
app.use('/api/users', userRouter)
app.use('/api/signin', signinRouter)
app.use('/api/signup', signupRouter)
app.use('/api/signout', signoutRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/settings', settingRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()

  console.log('Status of production mode:', PROD)
  console.log('Status of development mode:', DEV)
  console.log('Status of test mode:', TEST)

  if (TEST !== true) {
    await createAdminUser()
    await createGlobalRoomsWeekdays()
    await createRooms()
    await createMessages()
  }
}

if (TEST !== true) {
  start().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
}

module.exports = { app, start }