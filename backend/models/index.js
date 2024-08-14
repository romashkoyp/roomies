const Notification = require('./notification')
const User = require('./user')
const Session = require('./session')
const Room = require('./room')
const Booking = require('./booking')
const GlobalWeekday = require('./globalWeekday')
const GlobalDate = require('./globalDate')
const IndividualDate = require('./individualDate')

Notification.belongsTo(User)
User.hasMany(Notification)

Room.belongsTo(User)
User.hasMany(Room)

Booking.belongsTo(Room)
Room.hasMany(Booking)

Booking.belongsTo(User)
User.hasMany(Booking)

IndividualDate.belongsTo(Room)
Room.hasMany(IndividualDate)

Session.belongsTo(User)
User.hasMany(Session)

module.exports = {
  Notification,
  User,
  Session,
  Room,
  Booking,
  GlobalWeekday,
  GlobalDate,
  IndividualDate
}