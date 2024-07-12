const Notification = require('./notification')
const User = require('./user')

Notification.belongsTo(User)
User.hasMany(Notification)

module.exports = {
  Notification, User
}