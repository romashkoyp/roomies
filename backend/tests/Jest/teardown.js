const { sequelize } = require('../../util/db')

module.exports = async () => {
  try {
    await sequelize.close().catch((error) => {
      console.error('Error closing database connection:', error)
    })
    console.log('Connection with database closed')
    process.exit(0)
  } catch (error) {
    console.error('Error during closing database connection:', error)
    process.exit(1)
  }
}