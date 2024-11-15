const router = require('express').Router()
const { GlobalWeekday, GlobalDate } = require('../models')
const { tokenExtractor, isTokenUser, isAdmin, isSession } = require('../util/middleware')
const { body, validationResult } = require('express-validator')
const { createGlobalRoomsWeekdays } = require('../util/globalRoomsWeekdaysCreator')

const weekdaysCorrector = async (req, res, next) => {
  req.weekdays = await GlobalWeekday.findAll({
    order: [['dayOfWeek', 'ASC']],
  })

  if (req.weekdays.length !== 7) {
    await createGlobalRoomsWeekdays()
    req.weekdays = await GlobalWeekday.findAll({
      order: [['dayOfWeek', 'ASC']],
    })
  }

  if (req.weekdays.length !== 7) throw new Error('Check the database for correct storing global weekdays')
  next()
}

const weekdayFinder = async (req, res, next) => {
  const dayPattern = /^[0-6]$/
  if (!dayPattern.test(req.params.dayOfWeek)) throw new Error('Invalid day of week format. Required number 0-6')
  req.dayOfWeek = await GlobalWeekday.findOne({ where: { dayOfWeek: req.params.dayOfWeek } })
  if (!req.dayOfWeek) throw new Error('Day of week not found')
  next()
}

const dateFinder = async (req, res, next) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(req.params.date)) throw new Error('Invalid date format. Use YYYY-MM-DD')
  req.date = await GlobalDate.findOne({ where: { date: req.params.date } })
  if (!req.date) throw new Error('Date not found')
  next()
}

// Get all weekdays for all rooms
router.get('/weekdays', tokenExtractor, isTokenUser, isAdmin, isSession, weekdaysCorrector,
  async(req, res) => {
    res.json(req.weekdays)
  }
)

// Change for all weekdays global availability, time end, time begin
router.put('/weekdays', tokenExtractor, isTokenUser, isAdmin, isSession, weekdaysCorrector,
  async(req, res) => {
    const validationChain = []

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

    const updatedWeekdays = []

    if (req.body.availability === undefined) {
      throw new Error('Availability is required')
    }

    if (req.body.availability === true) {
      if (!req.body.time_begin || !req.body.time_end) {
        throw new Error('Time begin and time end required when availability is true')
      }
    } else if (req.body.availability === false) {
      req.body.time_begin = null
      req.body.time_end = null
    }

    for (let weekday of req.weekdays) {
      weekday.availability = req.body.availability
      weekday.timeBegin = req.body.time_begin
      weekday.timeEnd = req.body.time_end

      await weekday.save()
      updatedWeekdays.push(weekday)
    }

    if (req.body.availability === true || req.body.availability === false) {
      console.log('Global availability, time begin and time end for all weekdays updated')
    }

    return res.status(200).json(updatedWeekdays)
  }
)

// Reset to default for all weekdays global availability, time end, time begin
router.delete('/weekdays', tokenExtractor, isTokenUser, isAdmin, isSession, weekdaysCorrector,
  async (req, res) => {
    await GlobalWeekday.destroy({ truncate: true, cascade: false })
    await createGlobalRoomsWeekdays()
    res.status(204).end()
    console.log('Global settings for all days of week restored to default')
  }
)

// Change for one weekday global availability, time end, time begin
router.put('/weekdays/:dayOfWeek', tokenExtractor, isTokenUser, isAdmin, isSession, weekdaysCorrector, weekdayFinder,
  async(req, res) => {
    const validationChain = []

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

    if (req.body.availability === undefined) {
      throw new Error('Availability is required')
    }

    if (req.body.availability === true) {
      if (!req.body.time_begin || !req.body.time_end) {
        throw new Error('Time begin and time end required when availability is true')
      }
    } else if (req.body.availability === false) {
      req.body.time_begin = null
      req.body.time_end = null
    }

    req.dayOfWeek.availability = req.body.availability
    req.dayOfWeek.timeBegin = req.body.time_begin
    req.dayOfWeek.timeEnd = req.body.time_end

    await req.dayOfWeek.save()
    console.log('Global availability, time begin and time end for weekday updated')
    return res.status(200).json(req.dayOfWeek)
  }
)

// Reset to default desired weekday global availability, time end, time begin
router.delete('/weekdays/:dayOfWeek',tokenExtractor, isTokenUser, isAdmin, isSession, weekdaysCorrector, weekdayFinder,
  async(req, res) => {
    await req.dayOfWeek.destroy()
    await createGlobalRoomsWeekdays()
    res.status(204).end()
    console.log('Global settings day of week restored to default')
  }
)

// Get all global dates for all rooms
router.get('/dates', tokenExtractor, isTokenUser, isAdmin, isSession,
  async(req, res) => {
    const dates = await GlobalDate.findAll({
      order: [['date', 'ASC']]
    })

    res.json(dates)
  }
)

// Create new global date
router.post('/dates', tokenExtractor, isTokenUser, isAdmin, isSession,
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

    const dayOfWeekNumber = new Date(req.body.date).getDay()

    const globalDate = await GlobalDate.create({
      ...req.body,
      timeBegin: req.body.time_begin,
      timeEnd: req.body.time_end,
      dayOfWeek: dayOfWeekNumber
    })

    res.status(201).json(globalDate)
  }
)

// Delete one date
router.delete('/dates/:date', tokenExtractor, isTokenUser, isAdmin, isSession, dateFinder,
  async(req, res) => {
    await req.date.destroy()
    res.status(204).end()
    console.log('Date deleted from global settings')
  }
)

module.exports = router