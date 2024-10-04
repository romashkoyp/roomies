const router = require('express').Router()
const { sequelize } = require('../util/db')
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

// ROOM ROUTES
// Get all rooms
router.get('/', tokenExtractor, isTokenUser, isSession,
  async (req, res) => {
    const rooms = await Room.findAll({
      order: [['capacity', 'ASC']],
      attributes: { exclude: ['userId'] }
    })

    //if (!rooms.length) throw new Error('Rooms not found')
    res.status(200).json(rooms)
  }
)

// Create new room
router.post('/', tokenExtractor, isTokenUser, isAdmin, isSession,
  body('name')
    .notEmpty().withMessage('Name is required'),
  body('capacity')
    .notEmpty().withMessage('Capacity is required')
    .isInt({ gt: 1 }).withMessage('Capacity should be an integer'),
  body('size')
    .notEmpty().withMessage('Size is required')
    .isInt({ gt: 1 }).withMessage('Size should be an integer'),
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

// Delete all rooms
router.delete('/', tokenExtractor, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    await Room.destroy({ where: {} }) // find all rooms and delete them 1 by 1
    console.log('All rooms deleted')
    res.status(204).end()
  }
)

// INDIVIDUAL DATES ROUTES
// Get all dates for all rooms
router.get('/dates', tokenExtractor, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    const dates = await IndividualDate.findAll({
      order: [['date', 'DESC']],
      include: [
        {
          model: Room,
          attributes: { exclude: ['userId'] }
        }
      ]
    })

    //if (!dates.length) throw new Error('No dates available for rooms')
    res.status(200).json(dates)
  }
)

// Delete all dates for all rooms
router.delete('/dates', tokenExtractor, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    await IndividualDate.destroy({ truncate: true, cascade: false })
    res.status(204).end()
    console.log('All individual dates deleted for all rooms')
  }
)

// INDIVIDUAL ROOM ROUTES
// Get desired room
router.get('/:id', tokenExtractor, isTokenUser, isSession,
  async (req, res) => {
    const room = await Room.findOne({
      attributes: { exclude: ['userId'] }
    })

    if (!room) throw new Error('Room not found')
    res.status(200).json(room)
  }
)

// Change room characteristics
router.put('/:id', tokenExtractor, isTokenUser, isAdmin, isSession, roomFinder,
  async (req, res) => {
    const validationChain = []

    if (req.body.capacity) {
      validationChain.push(
        body('capacity').isInt({ gt: 1 }).withMessage('Capacity must be an integer greater than 1')
      )
    }

    if (req.body.size) {
      validationChain.push(
        body('size').isInt({ gt: 1 }).withMessage('Size must be an integer')
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
    return res.status(200).json(req.room)
  })

// Delete desired room
router.delete('/:id', tokenExtractor, isTokenUser, isAdmin, isSession, roomFinder,
  async (req, res) => {
    const t = await sequelize.transaction()
    try {
      await IndividualDate.destroy({ where: { roomId: req.room.id }, transaction: t })
      await Room.destroy({ where: { id: req.room.id }, transaction: t })
      console.log('Room and related records deleted')
      await t.commit()
      res.status(204).end()
    } catch (error) {
      await t.rollback()
      console.error('Error deleting room:', error)
    }
  }
)

// Get all dates for desired room
router.get('/:id/dates', tokenExtractor, isTokenUser, isAdmin, isSession, roomFinder,
  async(req, res) => {
    const dates = await IndividualDate.findAll({
      where: { roomId: req.params.id },
      order: [['date', 'DESC']],
      include: [
        {
          model: Room,
          attributes: { exclude: ['userId'] }
        }
      ]
    })

    //if (!dates.length) throw new Error('No dates available for current room')
    res.status(200).json(dates)
  }
)

// Get all rooms for desired date
router.get('/:date', tokenExtractor, isTokenUser, isSession, dateValidation,
  async (req, res) => {
    const { date } = req.params
    const rooms = await Room.findAll({
      include: [
        {
          model: Booking,
          where: { date, enabled: true },
          required: false,
          attributes: { exclude: ['roomId'] }
        },
        {
          model: IndividualDate,
          where: { date },
          required: false,
          attributes: { exclude: ['roomId'] }
        }
      ]
    })

    const response = []

    for (const room of rooms) {
      let settings

      if (room.individualDates.length === 1) {
        // eslint-disable-next-line no-unused-vars
        settings = room.individualDates
      } else if (!room.individualDates.length) {
        const globalDate = await GlobalDate.findOne({ where: { date } })
        const dayOfWeek = new Date(date).getDay()
        const globalWeekday = await GlobalWeekday.findOne({ where: { dayOfWeek } })

        if (globalDate) {
          room.settings = globalDate
        } else if (globalWeekday) {
          room.settings = globalWeekday
        } else {
          throw new Error('No settings found')
        }
      }

      response.push({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        size: room.size,
        imagePath: room.imagePath,
        date,
        bookings: room.bookings,
        settings: room.settings
      })
    }

    res.status(200).json(response)
  })

// Add new date for desired room
router.post('/:id/dates', tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
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
          .custom((value, { req }) => {
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

    const existingDay = await IndividualDate.findOne({ where: { roomId: req.params.id, date: req.body.date } })
    if (existingDay) throw new Error('Settings for the room on current date already exist. Delete previous settings.')

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
router.delete('/:id/dates', tokenExtractor, roomFinder, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    await IndividualDate.destroy({ where: { roomId: req.params.id }, cascade: false })
    res.status(204).end()
    console.log('All individual dates deleted from room settings')
  }
)

// Get desired date for desired room (for calendar)
router.get('/:id/:date', tokenExtractor, isTokenUser, isSession, roomFinder, dateValidation,
  async (req, res) => {
    const { id, date } = req.params
    const room = await Room.findOne({
      where: { id },
      include: [
        {
          model: Booking,
          where: { date, enabled: true },
          required: false,
          attributes: { exclude: ['roomId'] }
        },
        {
          model: IndividualDate,
          where: { date },
          required: false,
          attributes: { exclude: ['roomId'] }
        }
      ]
    })

    if (room.individualDates.length === 1) {
      room.settings = room.individualDates
    } else if (!room.individualDates.length) {
      const globalDate = await GlobalDate.findOne({ where: { date } })
      const dayOfWeek = new Date(date).getDay()
      const globalWeekday = await GlobalWeekday.findOne({ where: { dayOfWeek } })

      if (globalDate) {
        room.settings = globalDate
      } else if (globalWeekday) {
        room.settings = globalWeekday
      } else {
        throw new Error('No settings found')
      }
    }

    //if (room.settings.availability !== true) throw new Error('Room not available on this date')

    const response = {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      size: room.size,
      imagePath: room.imagePath,
      date,
      bookings: room.bookings,
      settings: room.settings
    }

    res.status(200).json(response)
  })

// Delete desired date for desired room
router.delete('/:id/:date', roomFinder, dateValidation, dateFinder, tokenExtractor, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    await IndividualDate.destroy({ where: { roomId: req.params.id, date: req.params.date }, cascade: false })
    res.status(204).end()
    console.log('All individual dates deleted from room settings')
  }
)

module.exports = router