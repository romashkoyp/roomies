const router = require('express').Router()
const { Notification, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

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

router.put('/:id', notificationFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  
  if (!user) {
    throw new Error('User not found')
  }

  if (user.enabled === undefined) {
    throw new Error('Account disabled') 
  }

  if (user.admin === undefined) {
    throw new Error('Not enough rights for changing notification') 
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

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  const notification = await Notification.create(req.body)

  if (!user) {
    throw new Error('User not found')
  }

  if (user.enabled === undefined) {
    throw new Error('Account disabled') 
  }

  if (user.admin === undefined) {
    throw new Error('Not enough rights for creating notification') 
  }

  if (notification) {
    console.log(notification.toJSON())
    res.status(201).json(notification)
  } else {
    throw new Error ('Notification not created')
  }
})

router.delete('/:id', tokenExtractor, notificationFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!user) {
    throw new Error('User not found')
  }

  if (user.enabled === undefined) {
    throw new Error('Account disabled') 
  }

  if (user.admin === undefined) {
    throw new Error('Not enough rights for deleting notification') 
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