const Notification = require('./notification')
const User = require('./user')
const Session = require('./session')
const Room = require('./room')
const Booking = require('./booking')
const Weekday = require('./weekday')
const Date = require('./date')
const GlobalWeekday = require('./global_weekday')
const GlobalDate = require('./global_date')

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
  GlobalWeekday,
  GlobalDate
}