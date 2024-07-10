const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to Postgres')
  } catch (err) {    
    console.log('Unable to connect to Postgres', err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase }