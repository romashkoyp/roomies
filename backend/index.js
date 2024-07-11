const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notificationRouter = require('./controllers/notifications')
const userRouter = require('./controllers/users')

const { errorHandler } = require('./util/middleware')

app.use(express.json())

app.use('/api/notifications', notificationRouter)
app.use('/api/users', userRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()