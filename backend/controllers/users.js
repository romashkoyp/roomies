const router = require('express').Router()
const { sequelize } = require('../util/db')
const { User, Notification, Room, Booking, Session } = require('../models')
const { body, validationResult } = require('express-validator')
const { tokenExtractor, isParamUser, isTokenUser, isAdminOrParamTokenUser, isSession, isAdmin } = require('../util/middleware')

const excludePasswordHash = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user.toJSON()
  return userWithoutPassword
}

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

    res.status(200).json(users)
  }
)

router.get('/:id', tokenExtractor, isTokenUser, isParamUser, isSession, isAdminOrParamTokenUser,
  async (req, res) => {
    res.status(200).json(excludePasswordHash(req.paramUser))
  }
)

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
    return res.status(200).json(excludePasswordHash(req.paramUser))
  }
)

router.delete('/:id', tokenExtractor, isTokenUser, isSession, isParamUser, isAdminOrParamTokenUser,
  async (req, res) => {
    const t = await sequelize.transaction()
    try {
      if (req.paramUser.admin === false) {
        await Notification.destroy({ where: { userId: req.params.id }, transaction: t })
        await Room.destroy({ where: { userId: req.params.id }, transaction: t })
        await Booking.destroy({ where: { userId: req.params.id }, transaction: t })
        await Session.destroy({ where: { userId: req.params.id }, transaction: t })
        await User.destroy({ where: { id: req.params.id }, transaction: t })
        console.log('User and related records deleted')
      } else if (req.paramUser.admin === true) {
        await User.destroy({ where: { id: req.params.id }, cascade: false })
        console.log('Admin user deleted')
      }

      await t.commit()
      res.status(204).end()
    } catch (error) {
      await t.rollback()
      console.error('Error deleting user:', error)}
  }
)

module.exports = router