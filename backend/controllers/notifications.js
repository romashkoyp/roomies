const router = require('express').Router()
const { Notification, User, Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { body, validationResult } = require('express-validator')

const notificationFinder = async (req, res, next) => {
  req.notification = await Notification.findByPk(req.params.id)
  if (!req.notification) {
    throw new Error('Notification not found')
  }
  next()
}

router.get('/', async (req, res) => {
  const notifications = await Notification.findAll({
    order: [['created_at', 'DESC']],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username']
    }
  })
    
  if (Array.isArray(notifications) && notifications.length !== 0) {
    res.json(notifications)
  } else {
    throw new Error('Notifications not found')
  }
})

router.get('/:id', notificationFinder,
  async (req, res) => {
    res.status(200).json(req.notification)
})

router.post('/', tokenExtractor,
  body('content')
    .notEmpty().withMessage('Content is required'),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }
  
    const user = await User.findByPk(req.decodedToken.id)
    const token = req.headers.authorization.substring(7)

    if (!user.id) {
      throw new Error('User not found from token')
    }

    if (user.enabled !== true) {
      throw new Error('Account disabled') 
    }

    if (user.admin !== true) {
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

    const notification = await Notification.create({
      ...req.body, 
      userId: user.id
    })

    if (notification) {
      console.log(notification.toJSON())
      res.status(201).json(notification)
    } else {
      throw new Error ('Notification not created')
    }
})

router.put('/:id', notificationFinder, tokenExtractor,
  body('content').notEmpty().withMessage('Content is required'),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

    const user = await User.findByPk(req.decodedToken.id)
    const token = req.headers.authorization.substring(7)
    
    if (!user.id) {
      throw new Error('User not found from token')
    }

    if (user.enabled !== true) {
      throw new Error('Account disabled') 
    }

    if (user.admin !== true) {
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

    if (req.body.content) {
      req.notification.content = req.body.content
      await req.notification.save()
      res.json(req.notification)
      console.log('notification updated')
    } else {
      throw new Error ('Notification not updated')
    }
})

router.delete('/:id', tokenExtractor, notificationFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const token = req.headers.authorization.substring(7)

  if (!user.id) {
    throw new Error('User not found from token')
  }

  if (user.enabled !== true) {
    throw new Error('Account disabled') 
  }

  if (user.admin !== true) {
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
    await req.notification.destroy()
    console.log('Notification deleted')
    res.status(204).end()
  } catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router