const { app, start } = require('../index')
const { PORT } = require('./config')

start().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})