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

    if (req.body.name) {
      validationChain.push(
        body('name').notEmpty().withMessage('Name is required')
      )
    }

    if (req.body.capacity) { 
      validationChain.push(
        body('capacity')
          .notEmpty().withMessage('Capacity is required')
          .isInt({gt: 1}).withMessage('Capacity should be an integer')
      )
    }

    if (req.body.size) {
      validationChain.push(
        body('size')
          .notEmpty().withMessage('Size is required')
          .isInt({gt: 1}).withMessage('Size should be an integer')
      )
    }

    if (req.body.image_path) {
      validationChain.push(
        body('image_path')
          .notEmpty().withMessage('Image path is required')
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

    if (req.body.image_path) {
      req.room.image_path = req.body.image_path
      console.log('Image path updated')
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