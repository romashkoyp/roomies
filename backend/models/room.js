const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Room extends Model {}
Room.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imagePath: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  timeBegin: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '08:00:00'
  },
  timeEnd: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '16:00:00'
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'room'
})

module.exports = Room