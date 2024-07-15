const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.message === 'Validation failed') {
    return res.status(400).json({ errors: error.errors })
  } else if (error.name === 'EmptyResultError') {
    return res.status(404).json({ error: 'Resource not found' })
  } else if (error.name === 'Error') {
    return res.status(404).json({ error: error.message })
  } else if (error instanceof Sequelize.DatabaseError) {
    return res.status(500).json({ error: 'Database error occurred' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  
  //next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor
}