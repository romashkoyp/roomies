const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class IndividualDate extends Model {}
IndividualDate.init({
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
  name: {
    type: DataTypes.TEXT,
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
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 6,
      isIn: {
        args: [[0, 1, 2, 3, 4, 5, 6]],
        msg: 'Invalid day of the week. Please enter a number between 0 and 6'
      }
    }
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'individualDate'
})

module.exports = IndividualDate