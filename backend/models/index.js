const Notification = require('./notification')
const User = require('./user')
const Session = require('./session')

Notification.belongsTo(User)
Session.belongsTo(User)
User.hasMany(Notification)
User.hasMany(Session)

module.exports = {
  Notification, User, Session
}