const router = require('express').Router()
const { Notification } = require('../models')

const notificationFinder = async (req, res, next) => {
  req.notification = await Notification.findByPk(req.params.id)
  if (!req.notification) {
    throw new Error('Notification not found')
  }
  next()
}

router.get('/', async (req, res) => {
  const notifications = await Notification.findAll({
    order: [['created_at', 'DESC']]
  })
    
  if (Array.isArray(notifications) && notifications.length !== 0) {
    res.json(notifications)
  } else {
    throw new Error('Notifications not found')
  }
})

router.put('/:id', notificationFinder, async (req, res) => {
  if (req.body.content) {
    req.notification.content = req.body.content
    await req.notification.save()
    res.json(req.notification)
    console.log('notification updated')
  } else {
    throw new Error ('Notification not updated')
  }
})

router.post('/', async (req, res) => {
  const notification = await Notification.create(req.body)

  if (notification) {
  console.log(notification.toJSON())
  res.status(201).json(notification)
  } else {
    throw new Error ('Notification not created')
  }
})

router.delete('/:id', notificationFinder, async (req, res) => {
  try {
    await req.notification.destroy()
    console.log('Notification deleted')
    res.status(204).end()
  } catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router