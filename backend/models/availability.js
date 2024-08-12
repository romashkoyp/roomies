const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Availability extends Model {}

Availability.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  availability: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'availability'
})

module.exports = Availability