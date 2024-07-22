const router = require('express').Router()
const { User, Notification, Session } = require('../models')
const { body, validationResult } = require('express-validator')
const { tokenExtractor } = require('../util/middleware')

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id)
  if (!req.user) {
    throw new Error('User not found')
  }
  next()
}

const excludePasswordHash = (user) => {
  const { passwordHash, ...userWithoutPassword } = user.toJSON()
  return userWithoutPassword
}

router.get('/', tokenExtractor,
  async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)

    if (!user.id) {
      throw new Error('User not found from token')
    }

    if (user.enabled !== true) {
      throw new Error('Account disabled') 
    }

    if (user.admin !== true) {
      throw new Error('Not enough rights') 
    }

    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: {
        model: Notification,
        attributes: { exclude: ['userId'] }
      }
    })

    if (Array.isArray(users) && users.length !== 0) {
      res.json(users)
    } else {
      throw new Error ('No users found')
    }
})

router.get('/:id', userFinder, tokenExtractor,
  async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const token = req.headers.authorization.substring(7)

    if (!user.id) {
      throw new Error('User not found from token')
    }

    if (user.enabled !== true) {
      throw new Error('Account disabled') 
    }

    if (parseInt(req.params.id, 10) !== user.id && user.admin !== true) {
      throw new Error('Not enough rights')
    }

    const session = await Session.findOne({
      where: {
        user_id: user.id,
        token: token
      }
    })
  
    if (!session) {
      throw new Error('Session not found')
    }
    
    res.status(200).json(excludePasswordHash(req.user))
})

router.put('/:id', userFinder, tokenExtractor,
  async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const token = req.headers.authorization.substring(7)

    if (!user.id) {
      throw new Error('User not found from token')
    }

    if (user.enabled !== true) {
      throw new Error('Account disabled') 
    }

    if (parseInt(req.params.id, 10) !== user.id && user.admin !== true) {
      throw new Error('Not enough rights') 
    }

    const session = await Session.findOne({
      where: {
        user_id: user.id,
        token: token
      }
    })
  
    if (!session) {
      throw new Error('Session not found')
    }

    const validationChain = []

    if (req.body.username) {
      validationChain.push(
        body('username').isEmail().withMessage('Invalid email format')
      )
    }

    if (req.body.admin !== undefined) { 
      validationChain.push(
        body('admin').isBoolean().withMessage('Allowed True or False for admin status')
      )
    }

    if (req.body.enabled !== undefined) {
      validationChain.push(
        body('enabled').isBoolean().withMessage('Allowed True or False for enabled status')
      )
    }

    await Promise.all(validationChain.map(validation => validation.run(req)))
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

    if (!req.body) { 
      throw new Error('No update data provided')
    }
    
    if (req.body.username) {
      req.user.username = req.body.username
      console.log('Username updated')
    }

    if (req.body.name) {
      req.user.name = req.body.name
      console.log('Name updated')
    }

    if (req.body.admin === false || req.body.admin === true) {
      if (user.admin === true) {
        req.user.admin = req.body.admin
        console.log('Admin rights updated')
      } else {
        throw new Error ('Not enough rights')
      }
    }

    if (req.body.enabled === false || req.body.enabled === true) {
      if (user.admin === true) {
        req.user.enabled = req.body.enabled
        console.log('Users\'s status updated')
      } else {
        throw new Error ('Not enough rights')
      }
    }

    await req.user.save()
    return res.status(201).json(excludePasswordHash(req.user))
})

router.delete('/:id', userFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const token = req.headers.authorization.substring(7)

  if (!user.id) {
    throw new Error('User not found from token')
  }

  if (user.enabled !== true) {
    throw new Error('Account disabled') 
  }

  if (parseInt(req.params.id, 10) !== user.id && user.admin !== true) {
    throw new Error('Not enough rights') 
  }

  const session = await Session.findOne({
    where: {
      user_id: user.id,
      token: token
    }
  })

  if (!session) {
    throw new Error('Session not found')
  }

  try {
    await req.user.destroy()
    console.log('User deleted')
    res.status(204).end()
  } catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router