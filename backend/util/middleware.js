const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SECRET } = require('./config')
const { User, Session } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.message === 'Validation failed') {
    return res.status(400).json({ errors: error.errors })
  } else if (error.name === 'EmptyResultError') {
    return res.status(404).json({ error: 'Resource not found' })
  } else if (error.name === 'Error') {
    return res.status(400).json({ error: error.message })
  } else if (error instanceof Sequelize.DatabaseError) {
    return res.status(500).json({ error: 'Database error occurred' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    const errorMessage = error.errors.map(err => err.message).join(', ')
    return res.status(400).json({ error: errorMessage })
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.token = authorization.substring(7)
      console.log('Token:', req.token)
      req.decodedToken = jwt.verify(req.token, SECRET)
    } catch {
      throw new Error('Token invalid')
    }
  }  else {
    throw new Error('Token missing')
  }

  next()
}

const isTokenUser = async (req, res, next) => {
  req.tokenUser = await User.findByPk(req.decodedToken.id)
  if (!req.tokenUser) throw new Error('User not found from token')
  if (req.tokenUser.enabled !== true) throw new Error('Account disabled')
  next()
}

const isSession = async (req, res, next) => {
  const session = await Session.findOne({ where: { user_id: req.tokenUser.id, token: req.token } })
  if (!session) throw new Error('Session not found')
  next()
}

const isParamUser = async (req, res, next) => {
  req.paramUser = await User.findByPk(req.params.id)
  if (!req.paramUser) throw new Error('User not found in database')
  next()
}

const isParamTokenUser = async (req, res, next) => {
  if (req.paramUser.id !== req.tokenUser.id) throw new Error('Not enough rights')
  next()
}

const isAdmin = async (req, res, next) => {
  if (req.tokenUser.admin !== true) throw new Error('Not enough rights')
  console.log('Token user admin:', req.tokenUser.admin)
  next()
}

const isAdminOrParamTokenUser = async (req, res, next) => {
  if (req.tokenUser.admin !== true && req.paramUser.id !== req.tokenUser.id)
    throw new Error('Not enough rights')
  next()
}

const passwordHash = async (password) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}

module.exports = {
  errorHandler,
  tokenExtractor,
  passwordHash,
  isParamUser,
  isTokenUser,
  isAdmin,
  isParamTokenUser,
  isAdminOrParamTokenUser,
  isSession
}