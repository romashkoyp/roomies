require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

let DATABASE_URL
let TEST
let DEV
let PROD

if (process.env.NODE_ENV === 'test') {
  TEST = true
  DEV = false
  PROD = false
  DATABASE_URL = process.env.TEST_DATABASE_URL
} else if (process.env.NODE_ENV === 'development') {
  DEV = true
  TEST = false
  PROD = false
  DATABASE_URL = process.env.DEV_DATABASE_URL
} else if (process.env.NODE_ENV === 'production') {
  PROD = true
  TEST = false
  DEV = false
  DATABASE_URL = process.env.PROD_DATABASE_URL
}

module.exports = {
  PORT,
  SECRET,
  DATABASE_URL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  TEST,
  DEV,
  PROD
}