require('dotenv').config()

const PORT = process.env.PORT

const SECRET = process.env.SECRET

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

const PASSWORD = process.env.PASSWORD

module.exports = {
  PORT,
  SECRET,
  DATABASE_URL,
  PASSWORD
}