const Sequelize = require('sequelize')

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'EmptyResultError') {
    return res.status(404).json({ error: 'Resource not found' })
  } else if (error.name === 'Error') {
    return res.status(404).json({ error: error.message })
  } else if (error instanceof Sequelize.DatabaseError) {
    return res.status(500).json({ error: 'Database error occurred' })
  }
  
  next(error)
}

module.exports = {
  errorHandler
}