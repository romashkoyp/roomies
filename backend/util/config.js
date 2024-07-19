require('dotenv').config()

const PORT = process.env.PORT

const SECRET = process.env.SECRET

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const SEED_ADMIN_USER = process.env.NODE_ENV === 'test'
  ? false
  : true

module.exports = {
  PORT,
  SECRET,
  DATABASE_URL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  SEED_ADMIN_USER
}