const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class GlobalAvailability extends Model {}

GlobalAvailability.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'globalAvailability'
})

module.exports = GlobalAvailability