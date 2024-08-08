const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Booking extends Model {}
Booking.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeBegin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  timeEnd: {
    type: DataTypes.TIME,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'booking'
})

module.exports = Booking