const Notification = require('./notification')
const User = require('./user')
const Session = require('./session')
const Room = require('./room')
const Booking = require('./booking')
const Weekday = require('./weekday')
const Date = require('./date')
const Availability = require('./availability')
const GlobalWeekday = require('./global_weekday')
const GlobalDate = require('./global_date')
const GlobalAvailability = require('./global_availability')

Notification.belongsTo(User)
User.hasMany(Notification)

Room.belongsTo(User)
User.hasMany(Room)

Booking.belongsTo(Room)
Room.hasMany(Booking)

Booking.belongsTo(User)
User.hasMany(Booking)

Weekday.belongsTo(Room)
Room.hasMany(Weekday)

Date.belongsTo(Room)
Room.hasMany(Date)

Availability.belongsTo(Room)
Room.hasOne(Availability)

Session.belongsTo(User)
User.hasMany(Session)

module.exports = {
  Notification,
  User,
  Session,
  Room,
  Booking,
  Weekday,
  Date,
  Availability,
  GlobalWeekday,
  GlobalDate,
  GlobalAvailability
}