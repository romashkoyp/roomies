const router = require('express').Router()
const { User, Notification, Room } = require('../models')
const { body, validationResult } = require('express-validator')
const { tokenExtractor, isParamUser, isTokenUser, isAdminOrParamTokenUser, isSession, isAdmin } = require('../util/middleware')

const excludePasswordHash = (user) => {
  const { passwordHash, ...userWithoutPassword } = user.toJSON()
  return userWithoutPassword
}

router.get('/:id', tokenExtractor, isTokenUser, isParamUser, isSession, isAdminOrParamTokenUser,
  async (req, res) => {
    res.status(200).json(excludePasswordHash(req.paramUser))
})

router.get('/', tokenExtractor, isTokenUser, isAdmin, isSession,
  async (req, res) => {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: [
        { 
          model: Notification,
          attributes: { exclude: ['userId'] }
        },
        {
          model: Room,
          attributes: { exclude: ['userId'] }
        }
      ]
    })

    if (!users.length) throw new Error ('No users found')

    res.status(200).json(users)
})

router.put('/:id', tokenExtractor, isTokenUser, isSession, isParamUser, isAdminOrParamTokenUser,
  async (req, res) => {
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

    if (!req.body) throw new Error('No update data provided')
    
    if (req.body.username) {
      req.paramUser.username = req.body.username
      console.log('Username updated')
    }

    if (req.body.name) {
      req.paramUser.name = req.body.name
      console.log('Name updated')
    }

    if (req.body.admin === false || req.body.admin === true) {
      if (req.tokenUser.admin === true) {
        req.paramUser.admin = req.body.admin
        console.log('Admin rights updated')
      } else {
        throw new Error ('Not enough rights')
      }
    }

    if (req.body.enabled === false || req.body.enabled === true) {
      if (req.tokenUser.admin === true) {
        req.paramUser.enabled = req.body.enabled
        console.log('Users\'s status updated')
      } else {
        throw new Error ('Not enough rights')
      }
    }

    await req.paramUser.save()
    return res.status(201).json(excludePasswordHash(req.paramUser))
})

router.delete('/:id', tokenExtractor, isTokenUser, isSession, isParamUser, isAdminOrParamTokenUser,
  async (req, res) => {
    await User.destroy({ where: { id: req.params.id }, cascade: false })
    res.status(204).end()
    console.log('User deleted')
})

module.exports = router