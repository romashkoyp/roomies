require('dotenv').config()

const PORT = process.env.PORT

const SECRET = process.env.SECRET

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const TEST = process.env.NODE_ENV === 'test'
  ? true
  : false

module.exports = {
  PORT,
  SECRET,
  DATABASE_URL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  TEST
}