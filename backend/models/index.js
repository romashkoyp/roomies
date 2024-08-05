const Notification = require('./notification')
const User = require('./user')
const Session = require('./session')
const Room = require('./room')

Notification.belongsTo(User)
Session.belongsTo(User)
Room.belongsTo(User)
User.hasMany(Notification)
User.hasMany(Session)
User.hasMany(Room)

module.exports = {
  Notification, User, Session, Room
}