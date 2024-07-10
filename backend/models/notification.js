const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Notification extends Model {}
Notification.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'notification'
})

module.exports = Notification