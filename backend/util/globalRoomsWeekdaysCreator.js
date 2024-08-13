const { GlobalWeekday } = require('../models')

const createGlobalRoomsWeekdays = async () => {
  const existingWeekdays = await GlobalWeekday.findAll()

  const existingDays = new Set(existingWeekdays.map(weekday => weekday.dayOfWeek))

  const allDays = [
    { dayOfWeek: 0, availability: false, timeBegin: '00:00:00', timeEnd: '00:00:00' },
    { dayOfWeek: 1, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },
    { dayOfWeek: 2, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },
    { dayOfWeek: 3, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },
    { dayOfWeek: 4, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },
    { dayOfWeek: 5, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },
    { dayOfWeek: 6, availability: false, timeBegin: '00:00:00', timeEnd: '00:00:00' },
  ]

  const missingDays = allDays.filter(day => !existingDays.has(day.dayOfWeek))

  if (missingDays.length > 0) {
    await GlobalWeekday.bulkCreate(missingDays)
    console.log('Missing global weekdays settings created!')
  } else {
    console.log('All global weekdays settings already exist in the database!')
  }
}

module.exports = { createGlobalRoomsWeekdays }
