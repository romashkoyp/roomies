const { GlobalAvailability } = require('../models')

const createGlobalRoomsAvailability = async () => {
  const existingAvailability = await GlobalAvailability.findOne({ where: {} })
  if (!existingAvailability) {
    await GlobalAvailability.create({
      availability: true,
    })
    console.log('Global availability settings for all rooms created!')
  } else {
    console.log('Global availability settings for all rooms exist in database!')
  }
}

module.exports = { createGlobalRoomsAvailability }