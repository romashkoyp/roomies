const router = require('express').Router()
const { Notification, User } = require('../models')
const { tokenExtractor, isTokenUser, isAdmin, isSession } = require('../util/middleware')
const { body, validationResult } = require('express-validator')

const notificationFinder = async (req, res, next) => {
  req.notification = await Notification.findByPk(req.params.id)
  if (!req.notification) throw new Error('Notification not found')
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

  //if (!notifications.length) throw new Error('Notifications not found')
  res.json(notifications)
})

router.get('/:id', notificationFinder,
  async (req, res) => {
    res.status(200).json(req.notification)
  })

router.post('/', tokenExtractor, isTokenUser, isAdmin, isSession,
  body('content')
    .notEmpty().withMessage('Content is required'),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

    const notification = await Notification.create({
      ...req.body,
      userId: req.tokenUser.id
    })

    res.status(201).json(notification)
  })

router.put('/:id', tokenExtractor, notificationFinder, isTokenUser, isSession, isAdmin,
  body('content').notEmpty().withMessage('Content is required'),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

    req.notification.content = req.body.content
    await req.notification.save()
    res.json(req.notification)
    console.log('notification updated')
  })

router.delete('/:id', tokenExtractor, notificationFinder, isTokenUser, isSession, isAdmin,
  async (req, res) => {
    await Notification.destroy({ where: { id: req.params.id } })
    res.status(204).end()
    console.log('Notification deleted')
  })

module.exports = router