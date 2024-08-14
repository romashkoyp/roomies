const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class GlobalWeekday extends Model {}
GlobalWeekday.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      min: 0,
      max: 6,
      isIn: {
        args: [[0, 1, 2, 3, 4, 5, 6]],
        msg: 'Invalid day of the week. Please enter a number between 0 and 6' 
      }
    }
  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: false
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
  modelName: 'globalWeekday'
})

module.exports = GlobalWeekday