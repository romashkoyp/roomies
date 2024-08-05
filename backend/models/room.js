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
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'room'
})

module.exports = Room