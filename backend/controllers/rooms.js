const router = require('express').Router()
const { Room, IndividualDate, GlobalDate, GlobalWeekday, Booking } = require('../models')
const { tokenExtractor, isTokenUser, isAdmin, isSession } = require('../util/middleware')
const { body, validationResult } = require('express-validator')

const roomFinder = async (req, res, next) => {
  req.room = await Room.findByPk(req.params.id)
  if (!req.room) throw new Error('Room not found')
  next()
}

const dateValidation = async (req, res, next) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(req.params.date)) throw new Error('Invalid date format. Use YYYY-MM-DD')
  next()
}

const dateFinder = async (req, res, next) => {
  req.date = await IndividualDate.findOne({ where: { date: req.params.date, roomId: req.params.id } })
  if (!req.date) throw new Error('Date not found for room')
  next()
}

// Get all rooms
router.get('/', tokenExtractor, isTokenUser, isSession,
  async (req, res) => {
    const rooms = await Room.findAll({
      order: [['capacity', 'ASC']],
      attributes: { exclude: ['userId'] }
    })
      
    if (rooms.length === 0) throw new Error('Rooms not found')
    res.status(200).json(rooms)     
    }
)

// Create new room
router.post('/', tokenExtractor, isTokenUser, isAdmin, isSession,
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

    const room = await Room.create({
      ...req.body,
      imagePath: req.body.image_path,
      userId: req.tokenUser.id
    })

    res.status(201).json(room)
})

// Get desired room for desired date
router.get('/:id/:date', roomFinder, dateValidation,//tokenExtractor, roomFinder, isTokenUser, isSession, dateFinder,
  async (req, res) => {
    const individualDate = await IndividualDate.findOne({
      where: {
        date: req.params.date,
        roomId: req.room.id
      }
    })

    const bookings = await Booking.findAll({
      where: {
        date: req.params.date,
        roomId: req.room.id,
        enabled: true
      }
    })

    if (individualDate) {
      req.room.dataValues.settings = individualDate
    } else {
      const globalDate = await GlobalDate.findOne({ where: { date: req.params.date } })
      const dayOfWeek = new Date(req.params.date).getDay()
      const globalWeekday = await GlobalWeekday.findOne({ where: { dayOfWeek: dayOfWeek } })
      if (globalDate) {
        req.room.dataValues.settings = globalDate
      } else if (globalWeekday) {
        req.room.dataValues.settings = globalWeekday
      } else {
        throw new Error('No global weekdays settings found')
      }
    }

    req.room.dataValues.bookings = bookings
    res.status(200).json(req.room)
})

// Change room characteristics
router.put('/:id', tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async (req, res) => {
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
router.delete('/:id', tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async (req, res) => {
    await req.room.destroy()
    console.log('Room deleted')
    res.status(204).end()
  }
)

// Delete all rooms
router.delete('/:id', tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    await req.room.destroy({ truncate: true, cascade: false })
  }
)

// Get all dates for desired room
router.get('/:id/settings/dates', roomFinder,//tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    const dates = await IndividualDate.findAll({
      where: { roomId: req.params.id },
      order: [['date', 'ASC']]
    })

    if (dates.length === 0) throw new Error('No dates available for current room')
    res.status(200).json(dates)
  }
)

// Get all dates for all rooms
router.get('/settings/dates', tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    const dates = await IndividualDate.findAll({
      order: [['date', 'ASC']]
    })

    if (dates.length === 0) throw new Error('No dates available for rooms')
    res.status(200).json(dates)
  }
)

// Add new date for desired room
router.post('/:id/settings/dates', roomFinder,//tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async(req, res) => {
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

    res.status(201).json(date)
    console.log('New date settings for room created')
  }
)

// Delete all dates for desired room
router.delete('/:id/settings/dates', tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    await IndividualDate.destroy({ where: { roomId: req.params.id }, cascade: false })
    res.status(204).end()
    console.log('All individual dates deleted from room settings')
  }
)

// Delete desired date for desired room
router.delete('/:id/settings/dates/:date', roomFinder, dateValidation, dateFinder, tokenExtractor, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    await IndividualDate.destroy({ where: { roomId: req.params.id, date: req.params.date }, cascade: false })
    res.status(204).end()
    console.log('All individual dates deleted from room settings')
  }
)

// Delete all dates for all rooms
router.delete('/settings/dates/', tokenExtractor, isTokenUser, isAdmin, isSession,
  async(req, res) => {    
    await IndividualDate.destroy({ truncate: true, cascade: false })
    res.status(204).end()
    console.log('All individual dates deleted for all rooms')
  }
)

module.exports = router