const router = require('express').Router()
const { Room, User, Session, Booking } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { body, validationResult } = require('express-validator')
const { Op } = require('sequelize')

router.post('/rooms/:roomId/bookings', tokenExtractor,
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
  body('time_begin')
    .notEmpty().withMessage('Beginning time is required')
    .isTime().withMessage('Beginning time must be in HH:MM format'),
  body('time_end')
    .notEmpty().withMessage('Ending time is required')
    .isTime().withMessage('Ending time must be in HH:MM format'),
  body('time_begin')
    .custom((value, {req}) => {
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

    const roomId = parseInt(req.params.roomId, 10)

    const room = await Room.findOne({
      where: {
        id: roomId,
        enabled: true
      }
    })
      
    if (!room) {
      throw new Error('Room not found')
    }

    const bookingBegins = req.body.time_begin + ':00'
    const bookingEnds = req.body.time_end + ':00'

    if (
      bookingBegins < room.timeBegin ||
      bookingBegins >= room.timeEnd ||
      bookingEnds > room.timeEnd ||
      bookingEnds <= room.timeBegin
    ) {
      throw new Error('Booking time is outside the room\'s available hours')
    }

    const existingBookings = await Booking.findAll({
      where: {
        roomId: room.id,
        date: req.body.date,
        enabled: true
      }
    })

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
      userId: user.id,
      roomId: room.id
    })

    if (booking) {
      console.log(booking.toJSON())
      res.status(201).json(booking)
    } else {
      throw new Error ('Booking not created')
    }
})

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

    const bookings = await Booking.findAll()
      
    if (Array.isArray(bookings) && bookings.length !== 0) {
      res.json(bookings)
    } else {
      throw new Error('Bookings not found')
    }
})

router.get('/:id', tokenExtractor,
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

    const booking = await Booking.findByPk(req.params.id)

    if (!booking) {
      throw new Error('Booking not found')
    }
    
    res.status(200).json(booking)
})

router.delete('/:id', tokenExtractor,
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

    const booking = await Booking.findByPk(req.params.id)

    if (!booking) {
      throw new Error('Booking not found')
    }

    await booking.destroy()
    res.status(204).end()
    console.log('Booking deleted')
  }
)

router.put('/:id', tokenExtractor,
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

    const currentBooking = await Booking.findByPk(req.params.id)
    const existingBookings = await Booking.findAll({
      where: {
        id: {
          [Op.ne]: req.params.id // exclude currentBooking
        },
        roomId: room.id,
        date: currentBooking.date,
        enabled: true
      }
    })

    const room = await Room.findOne({
      where: {
        id: currentBooking.room_id,
        enabled: true
      }
    })
      
    if (!room) {
      throw new Error('Room not found')
    }

    const validationChain = []

    if (req.body.enabled !== undefined) {
      validationChain.push(
        body('enabled').isBoolean().withMessage('Allowed True or False for enabled status')
      )
    }
    
    if (req.body.date && !req.body.time_begin && !req.body.time_end) { 
      validationChain.push(
        body('date')
          .isDate()
          .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
          .custom((value) => {
            const today = new Date().toISOString().slice(0, 10)
            return value >= today
          }).withMessage('Date must be today or a future date')
      )

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
    } else {
      validationChain.push(
        body('date')
          .isDate()
          .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
          .custom((value) => {
            const today = new Date().toISOString().slice(0, 10)
            return value >= today
          }).withMessage('Date must be today or a future date')
      )
    }

    if (req.body.time_begin && !req.body.time_end) {
      const bookingBegins = req.body.time_begin + ':00'
      validationChain.push(
        body('time_begin')
          .isTime().withMessage('Beginning time must be in HH:MM format')
          .custom(() => {
            if (
              bookingBegins >= room.timeEnd ||
              bookingBegins < room.timeBegin
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

    if (!req.body.time_begin && req.body.time_end) { 
      const bookingEnds = req.body.time_end + ':00'
      validationChain.push(
        body('time_end')
          .isTime().withMessage('Ending time must be in HH:MM format')
          .custom(() => {
            if (
              bookingEnds > room.timeEnd ||
              bookingEnds <= room.timeBegin
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

    if (req.body.time_begin && req.body.time_end) {
      validationChain.push(
        body('time_begin')
          .isTime().withMessage('Beginning time must be in HH:MM format'),
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

      const bookingBegins = req.body.time_begin + ':00'
      const bookingEnds = req.body.time_end + ':00'
  
      if (
        bookingBegins < room.timeBegin ||
        bookingBegins >= room.timeEnd ||
        bookingEnds > room.timeEnd ||
        bookingEnds <= room.timeBegin
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
    return res.status(201).json(currentBooking)
  }
)

module.exports = router