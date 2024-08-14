const router = require('express').Router()
const { Room, User, Session, IndividualDate } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { body, validationResult } = require('express-validator')

const roomFinder = async (req, res, next) => {
  req.room = await Room.findByPk(req.params.id)
  if (!req.room) throw new Error('Room not found')
  next()
}

const dateFinder = async (req, res, next) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(req.params.date)) throw new Error('Invalid date format. Use YYYY-MM-DD')
  req.date = await IndividualDate.findOne({ where: { date: req.params.date, roomId: req.params.id } })
  if (!req.date) throw new Error('Date not found for room')
  next()
}

// Get all rooms
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

// Create new room
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

    res.status(201).json(room)
})

// Get desired room
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

// Change room characteristics
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

    await req.room.save()
    return res.status(201).json(req.room)
})

// Delete desired room
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

    await Room.destroy({ where: { roomId: req.params.id }, cascade: false })
    console.log('Room deleted')
    res.status(204).end()
  }
)

// Delete all rooms
router.delete('/:id', tokenExtractor,
  async(req, res) => {
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

    await req.room.destroy({ truncate: true, cascade: false })
  }
)

// Get all dates for desired room
router.get('/:id/settings/dates', roomFinder, tokenExtractor,
  async(req, res) => {
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

    const dates = await IndividualDate.findAll({
      where: { roomId: req.params.id },
      order: [['date', 'ASC']]
    })

    if (dates.length === 0) throw new Error('No dates available for current room')
    res.json(dates)
  }
)

// Get all dates for all rooms
router.get('/settings/dates', tokenExtractor,
  async(req, res) => {
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

    const dates = await IndividualDate.findAll({
      order: [['date', 'ASC']]
    })

    if (dates.length === 0) throw new Error('No dates available for rooms')
    res.json(dates)
  }
)

// Add new date for desired room
router.post('/:id/settings/dates', roomFinder, tokenExtractor,
  async(req, res) => {
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

    if (req.body.date) {
      validationChain.push(
        body('date')
          .isDate()
          .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
      )
    }

    if (req.body.availability !== undefined) {
      validationChain.push(
        body('availability').isBoolean().withMessage('Availability must be true or false')
      )
    }

    if (
      req.body.time_begin && !req.body.time_end ||
      !req.body.time_begin && req.body.time_end
    ) throw new Error('Time begin and time end must be in request')

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
    
    if (!req.body.name) throw new Error('Name required')
    if (!req.body.date) throw new Error('Date required')
    if (req.body.availability === undefined) throw new Error('Availability is required')

    if (req.body.date && req.body.availability === true) {
      if (!req.body.time_begin || !req.body.time_end)
        throw new Error('Time begin and time end required when availability is true')
    } else if (req.body.availability === false) {
      req.body.time_begin = null
      req.body.time_end = null
    }

    const dayOfWeekNumber = new Date(req.body.date).getDay()

    const date = await IndividualDate.create({
      ...req.body,
      timeBegin: req.body.time_begin,
      timeEnd: req.body.time_end,
      dayOfWeek: dayOfWeekNumber,
      roomId: req.room.id
    })

    if (date) {
      res.status(201).json(date)
      console.log('New date settings for room created')
    } else {
      throw new Error ('Settings for desired date not created')
    }
  }
)

// Delete all dates for desired room
router.delete('/:id/settings/dates', roomFinder, tokenExtractor,
  async(req, res) => {
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

    await IndividualDate.destroy({ where: { roomId: req.params.id }, cascade: false })
    res.status(204).end()
    console.log('All dates deleted from room settings')
  }
)

// Delete desired date for desired room
router.delete('/:id/settings/dates/:date', roomFinder, dateFinder, tokenExtractor,
  async(req, res) => {
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

    await IndividualDate.destroy({ where: { roomId: req.params.id, date: req.params.date }, cascade: false })
    res.status(204).end()
    console.log('All dates deleted from room settings')
  }
)

// Delete all dates for all rooms
router.delete('/settings/dates/', tokenExtractor,
  async(req, res) => {
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
    
    await IndividualDate.destroy({ truncate: true, cascade: false })
    res.status(204).end()
    console.log('Dates deleted for all rooms')
  }
)

module.exports = router