const { GlobalAvailability } = require('../models')

const createGlobalRoomsAvailability = async () => {
  const existingAvailability = await GlobalAvailability.findOne({ where: {} })
  if (!existingAvailability) {
    await GlobalAvailability.create({
      availability: true,
    })
    console.log('Global availability settings created!')
  } else {
    console.log('Global availability settings exist in database!')
  }
}

module.exports = { createGlobalRoomsAvailability }