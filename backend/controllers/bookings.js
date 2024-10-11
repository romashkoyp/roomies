const router = require('express').Router()
const { Room, Booking, IndividualDate, GlobalDate, GlobalWeekday } = require('../models')
const { tokenExtractor, isTokenUser, isSession } = require('../util/middleware')
const { body, validationResult } = require('express-validator')
const { Op } = require('sequelize')

const bookingFinder = async (req, res, next) => {
  req.booking = await Booking.findByPk(req.query.id)
  console.log(req.booking)
  if (!req.query.id) throw new Error('Booking ID is required')
  if (!req.booking) throw new Error('Booking not found')
  next()
}

const isUsersBookingOrAdmin = async (req, res, next) => {
  if (req.booking.userId !== req.tokenUser.id && req.tokenUser.admin !== true)
    throw new Error('Not enough rights')
  next()
}

const dateValidation = async (req, res, next) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(req.body.date)) throw new Error('Invalid date format. Use YYYY-MM-DD')
  next()
}

// Get all bookings for all rooms by date
router.get('/', tokenExtractor, isTokenUser, isSession,
  async (req, res) => {
    // const { date } = req.params
    const date = req.query.date
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!date) throw new Error ('Date is required')
    if (!datePattern.test(req.query.date)) throw new Error('Invalid date format. Use YYYY-MM-DD')
    const rooms = await Room.findAll({
      include: [
        {
          model: Booking,
          where: { date, enabled: true },
          required: false,
        },
        {
          model: IndividualDate,
          where: { date },
          required: false,
        }
      ]
    })

    const response = []

    for (const room of rooms) {
      const individualDate = await IndividualDate.findOne({ where: { date, roomId: room.id } })
      const globalDate = await GlobalDate.findOne({ where: { date } })
      const dayOfWeek = new Date(date).getDay()
      const globalWeekday = await GlobalWeekday.findOne({ where: { dayOfWeek } })

      if (individualDate) {
        room.settings = individualDate
      } else if (globalDate) {
        room.settings = globalDate
      } else if (globalWeekday) {
        room.settings = globalWeekday
      } else {
        throw new Error('No settings found')
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

// Create new booking for desired room on desired date
router.post('/', tokenExtractor, isTokenUser, isSession, dateValidation,
  body('name')
    .notEmpty().withMessage('Name is required'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isDate()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
    .custom((value) => {
      const today = new Date().toISOString().slice(0, 10)
      return value >= today
    }).withMessage('Date must be today or a future date'),
  body('room_id')
    .notEmpty().withMessage('Room ID is required')
    .isInt().withMessage('Room ID must be an integer'),
  body('time_begin')
    .notEmpty().withMessage('Beginning time is required')
    .isTime().withMessage('Beginning time must be in HH:MM format'),
  body('time_end')
    .notEmpty().withMessage('Ending time is required')
    .isTime().withMessage('Ending time must be in HH:MM format'),
  body('time_begin')
    .custom((value, { req }) => {
      if (value >= req.body.time_end) {
        throw new Error('Time begin (request) must be before time end (request)')
      }
      return true
    }),

  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

    let settings = null

    const individualDate = await IndividualDate.findOne({
      where: {
        date: req.body.date,
        roomId: req.body.room_id
      }
    })

    if (individualDate) {
      settings = individualDate
    } else {
      const globalDate = await GlobalDate.findOne({ where: { date: req.body.date } })
      const dayOfWeek = new Date(req.body.date).getDay()
      const globalWeekday = await GlobalWeekday.findOne({ where: { dayOfWeek } })
      if (globalDate) {
        settings = globalDate
      } else if (globalWeekday) {
        settings = globalWeekday
      } else {
        throw new Error('No global weekdays settings found')
      }
    }

    const { timeBegin, timeEnd, availability } = settings

    if (availability !== true) throw new Error('Room not available on this date')

    const seconds = ':00'
    const bookingBegins = req.body.time_begin + seconds
    const bookingEnds = req.body.time_end + seconds

    // Compare time between request and time schedule from room settings
    if (
      bookingBegins < timeBegin ||
      bookingBegins >= timeEnd ||
      bookingEnds > timeEnd ||
      bookingEnds <= timeBegin
    ) {
      throw new Error('Booking time is outside the room\'s available hours')
    }

    const existingBookings = await Booking.findAll({
      where: {
        roomId: req.body.room_id,
        date: req.body.date,
        enabled: true
      }
    })

    // Compare time between request and time from all bookings
    for (const existingBooking of existingBookings) {
      const existingBegins = existingBooking.timeBegin
      const existingEnds = existingBooking.timeEnd

      if (
        (bookingBegins >= existingBegins && bookingBegins < existingEnds) ||
        (bookingEnds > existingBegins && bookingEnds <= existingEnds) ||
        (bookingBegins <= existingBegins && bookingEnds >= existingEnds)
      ) {
        throw new Error('Time slot is already booked')
      }
    }

    const booking = await Booking.create({
      ...req.body,
      timeBegin: req.body.time_begin,
      timeEnd: req.body.time_end,
      userId: req.tokenUser.id,
      roomId: req.body.room_id
    })

    res.status(201).json(booking)
  })

// Change desired booking by user or admin
router.put('/', tokenExtractor, isTokenUser, isSession, bookingFinder, isUsersBookingOrAdmin,
  async (req, res) => {
    // const { id } = req.params
    const id = req.booking.id
    const currentBooking = req.booking
    const actualDate = req.body.date ? req.body.date : currentBooking.date

    if (req.body.enabled !== undefined) {
      if (typeof req.body.enabled !== 'boolean') throw new Error('Allowed True or False for enabled status')
    }

    if (req.body.date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) throw new Error('Date must be in YYYY-MM-DD format')
      const today = new Date().toISOString().slice(0, 10)
      if (req.body.date < today) throw new Error('Date must be today or a future date')
    }

    // Get room settings for desired date
    let settings = null

    const individualDate = await IndividualDate.findOne({
      where: {
        date: actualDate,
        roomId: currentBooking.roomId
      }
    })

    if (individualDate) {
      settings = individualDate
    } else {
      const globalDate = await GlobalDate.findOne({ where: { date: actualDate } })
      const dayOfWeek = new Date(actualDate).getDay()
      const globalWeekday = await GlobalWeekday.findOne({ where: { dayOfWeek } })
      if (globalDate) {
        settings = globalDate
      } else if (globalWeekday) {
        settings = globalWeekday
      } else {
        throw new Error('No global weekdays settings found')
      }
    }

    const { timeBegin, timeEnd, availability } = settings

    if (availability !== true) throw new Error('Room not available on this date')

    // Find all bookings for room and date except current booking
    const existingBookings = await Booking.findAll({
      where: {
        id: {
          [Op.ne]: id // exclude currentBooking
        },
        roomId: currentBooking.roomId,
        date: actualDate,
        enabled: true
      }
    })

    const validationChain = []

    // User wants to change date only, but save time begin and time end
    if (req.body.date && !req.body.time_begin && !req.body.time_end) {
      for (const existingBooking of existingBookings) {
        const existingBegins = existingBooking.timeBegin
        const existingEnds = existingBooking.timeEnd
        if (
          (currentBooking.timeBegin >= existingBegins && currentBooking.timeBegin < existingEnds) ||
          (currentBooking.timeEnd > existingBegins && currentBooking.timeEnd <= existingEnds) ||
          (currentBooking.timeBegin <= existingBegins && currentBooking.timeEnd >= existingEnds)
        ) {
          throw new Error('Time slot is already booked')
        }
      }
    }

    const seconds = ':00'

    // User wants to change only time begin
    if (req.body.time_begin && !req.body.time_end) {
      const bookingBegins = req.body.time_begin + seconds
      validationChain.push(
        body('time_begin')
          .isTime().withMessage('Beginning time must be in HH:MM format')
          .custom(() => {
            if (
              bookingBegins >= timeEnd ||
              bookingBegins < timeBegin
            ) throw new Error('Booking beginning time is outside the room\'s available hours')
            if (bookingBegins >= currentBooking.timeEnd) {
              throw new Error('Booking beginning time (request) must be before booking end time (database)')
            }
            return true
          })
      )

      for (const existingBooking of existingBookings) {
        if (
          (bookingBegins >= existingBooking.timeBegin && bookingBegins < existingBooking.timeEnd) ||
          (currentBooking.timeEnd > existingBooking.timeBegin && currentBooking.timeEnd <= existingBooking.timeEnd) ||
          (bookingBegins <= existingBooking.timeBegin && currentBooking.timeEnd >= existingBooking.timeEnd)
        ) {
          throw new Error('Time slot is already booked')
        }
      }
    }

    // User wants to change only time end
    if (!req.body.time_begin && req.body.time_end) {
      const bookingEnds = req.body.time_end + seconds
      validationChain.push(
        body('time_end')
          .isTime().withMessage('Ending time must be in HH:MM format')
          .custom(() => {
            if (
              bookingEnds > timeEnd ||
              bookingEnds <= timeBegin
            ) throw new Error('Booking ending time is outside the room\'s available hours')
            if (bookingEnds <= currentBooking.timeBegin) {
              throw new Error('Booking ending time (request) must be after booking beginning time (database)')
            }
            return true
          })
      )

      for (const existingBooking of existingBookings) {
        if (
          (currentBooking.timeBegin >= existingBooking.timeBegin && currentBooking.timeBegin < existingBooking.timeEnd) ||
          (bookingEnds > existingBooking.timeBegin && bookingEnds <= existingBooking.timeEnd) ||
          (currentBooking.timeBegin <= existingBooking.timeBegin && bookingEnds >= existingBooking.timeEnd)
        ) {
          throw new Error('Time slot is already booked')
        }
      }
    }

    // User wants to change time begin and time end
    if (req.body.time_begin && req.body.time_end) {
      validationChain.push(
        body('time_begin')
          .isTime().withMessage('Beginning time must be in HH:MM format'),
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

      const bookingBegins = req.body.time_begin + seconds
      const bookingEnds = req.body.time_end + seconds

      if (
        bookingBegins < timeBegin ||
        bookingBegins >= timeEnd ||
        bookingEnds > timeEnd ||
        bookingEnds <= timeBegin
      ) {
        throw new Error('Booking time is outside the room\'s available hours')
      }

      for (const existingBooking of existingBookings) {
        const existingBegins = existingBooking.timeBegin
        const existingEnds = existingBooking.timeEnd

        if (
          (bookingBegins >= existingBegins && bookingBegins < existingEnds) ||
          (bookingEnds > existingBegins && bookingEnds <= existingEnds) ||
          (bookingBegins <= existingBegins && bookingEnds >= existingEnds)
        ) {
          throw new Error('Time slot is already booked')
        }
      }
    }

    await Promise.all(validationChain.map(validation => validation.run(req)))
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

    if (req.body.date) {
      currentBooking.date = req.body.date
      console.log('Date updated')
    }

    if (req.body.name) {
      currentBooking.name = req.body.name
      console.log('Name updated')
    }

    if (req.body.enabled === false || req.body.enabled === true) {
      currentBooking.enabled = req.body.enabled
      console.log('Enabled updated')
    }

    if (req.body.time_begin) {
      currentBooking.timeBegin= req.body.time_begin
      console.log('Time begin updated')
    }

    if (req.body.time_end) {
      currentBooking.timeEnd= req.body.time_end
      console.log('Time end updated')
    }

    await currentBooking.save()
    return res.status(200).json(currentBooking)
  }
)

// Delete desired booking by user or admin
router.delete('/', tokenExtractor, isTokenUser, isSession, bookingFinder, isUsersBookingOrAdmin,
  async (req, res) => {
    await req.booking.destroy()
    res.status(204).end()
    console.log('Booking deleted')
  }
)

// // Get all bookings for all rooms
// router.get('/', tokenExtractor, isTokenUser, isSession,
//   async (req, res) => {
//     const bookings = await Booking.findAll()
//     if (!bookings.length) throw new Error('Bookings for all rooms not found')
//     res.status(200).json(bookings)
//   }
// )

// // Get desired booking
// router.get('/:id', tokenExtractor, isTokenUser, isSession, bookingFinder,
//   async (req, res) => res.status(200).json(req.booking)
// )

module.exports = router