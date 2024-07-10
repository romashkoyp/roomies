const router = require('express').Router()
const { Notification } = require('../models')

router.post('/', async (req, res) => {
  try {
    const notification = await Notification.create(req.body)

    if (notification) {
    console.log(notification.toJSON())
    res.status(201).json(notification)
    } 
  } catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router