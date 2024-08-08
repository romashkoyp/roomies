const router = require('express').Router()
const { Room, User, Session, Booking } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const { body, validationResult } = require('express-validator')

router.post('/', tokenExtractor,
  body('name')
    .notEmpty().withMessage('Name is required'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isDate()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
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
  body('room_id')
    .notEmpty().withMessage('Room\'s ID is required')
    .isInt().withMessage('Room\'s ID must be an integer'),

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

    const room = await Room.findOne({
      where: {
        id: req.body.room_id,
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
      bookingEnds > room.timeEnd
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
      if (
        (bookingBegins >= existingBooking.timeBegin && bookingBegins < existingBooking.timeEnd) ||
        (bookingEnds > existingBooking.timeBegin && bookingEnds <= existingBooking.timeEnd) ||
        (bookingBegins <= existingBooking.timeBegin && bookingEnds >= existingBooking.timeEnd)
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

module.exports = router