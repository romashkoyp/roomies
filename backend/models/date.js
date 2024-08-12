const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Date extends Model {}
Date.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  timeBegin: {
    type: DataTypes.TIME,
    allowNull: true
  },
  timeEnd: {
    type: DataTypes.TIME,
    allowNull: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'date'
})

module.exports = Date