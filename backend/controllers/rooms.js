const router = require('express').Router()
const { Room, User, Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { body, validationResult } = require('express-validator')

const roomFinder = async (req, res, next) => {
  req.room = await Room.findByPk(req.params.id)
  if (!req.room) {
    throw new Error('Room not found')
  }
  next()
}

router.get('/', tokenExtractor,
  async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const token = req.headers.authorization.substring(7)
  
    if (!user.id) {
      throw new Error('User not found from token')
    }
  
    if (user.enabled !== true) {
      throw new Error('Account disabled') 
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

    const rooms = await Room.findAll({
      order: [['capacity', 'ASC']],
      attributes: { exclude: ['userId'] }
    })
      
    if (Array.isArray(rooms) && rooms.length !== 0) {
      res.json(rooms)
    } else {
      throw new Error('Rooms not found')
    }
})

router.get('/:id', roomFinder, tokenExtractor,
  async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const token = req.headers.authorization.substring(7)
  
    if (!user.id) {
      throw new Error('User not found from token')
    }
  
    if (user.enabled !== true) {
      throw new Error('Account disabled') 
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

    res.status(200).json(req.room)
})

router.post('/', tokenExtractor,
  body('name')
    .notEmpty().withMessage('Name is required'),
  body('capacity')
    .notEmpty().withMessage('Capacity is required')
    .isInt({gt: 1}).withMessage('Capacity should be an integer'),
  body('size')
    .notEmpty().withMessage('Size is required')
    .isInt({gt: 1}).withMessage('Size should be an integer'),
  body('image_path')
    .notEmpty().withMessage('Image path is required'),

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

    const room = await Room.create({
      ...req.body,
      imagePath: req.body.image_path,
      userId: user.id
    })

    if (room) {
      console.log(room.toJSON())
      res.status(201).json(room)
    } else {
      throw new Error ('Room not created')
    }
})

router.put('/:id', roomFinder, tokenExtractor,
  async (req, res) => {
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

    const validationChain = []

    if (req.body.capacity) { 
      validationChain.push(
        body('capacity').isInt({gt: 1}).withMessage('Capacity must be an integer')
      )
    }

    if (req.body.size) {
      validationChain.push(
        body('size').isInt({gt: 1}).withMessage('Size must be an integer')
      )
    }

    if (req.body.enabled !== undefined) {
      validationChain.push(
        body('enabled').isBoolean().withMessage('Enabled must be true or false')
      )
    }

    if (req.body.time_begin && !req.body.time_end) {
      validationChain.push(
        body('time_begin')
          .isTime().withMessage('Beginning time must be in HH:MM format')
          .custom((value, {req}) => {
            const newBeginTime = value + ':00'
            if (newBeginTime >= req.room.timeEnd) {
              throw new Error('Time begin (request) must be before time end (database)')
            }
            return true
          })
      )
    }

    if (req.body.time_end && !req.body.time_begin) {
      validationChain.push(
        body('time_end')
          .isTime().withMessage('Ending time must be in HH:MM format')
          .custom((value, {req}) => {
            const newEndTime = value + ':00'
            if (newEndTime <= req.room.timeBegin) {
              throw new Error('Time end (request) must be after time begin (database)')
            }
            return true
          })
      )
    }

    if (req.body.time_begin && req.body.time_end) {
      validationChain.push(
        body('time_begin')
          .isTime().withMessage('Begin time must be in HH:MM format'),
        body('time_end')
          .isTime().withMessage('Ending time must be in HH:MM format'),
        body('time_begin')
          .custom((value, {req}) => {
            if (value >= req.body.time_end) {
              throw new Error('Time begin (request) must be before time end (request)')
            }
            return true
          })
      )
    }

    await Promise.all(validationChain.map(validation => validation.run(req)))
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }
 
    if (req.body.name) {
      req.room.name = req.body.name
      console.log('Name updated')
    }

    if (req.body.capacity) {
      req.room.capacity = req.body.capacity
      console.log('Capacity updated')
    }

    if (req.body.size) {
      req.room.size = req.body.size
      console.log('Size updated')
    }

    if (req.body.enabled === false || req.body.enabled === true) {
      req.room.enabled = req.body.enabled
      console.log('Enabled updated')
    }

    if (req.body.image_path) {
      req.room.imagePath = req.body.image_path
      console.log('Image path updated')
    }

    if (req.body.time_begin) {
      req.room.timeBegin = req.body.time_begin
      console.log('Beginning time updated')
    }

    if (req.body.time_end) {
      req.room.timeEnd = req.body.time_end
      console.log('Ending time updated')
    }

    await req.room.save()
    return res.status(201).json(req.room)
})

router.delete('/:id', roomFinder, tokenExtractor,
  async (req, res) => {
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
      await req.room.destroy()
      console.log('Room deleted')
      res.status(204).end()
    } catch(error) {
      return res.status(400).json({ error })
    }
})

module.exports = router