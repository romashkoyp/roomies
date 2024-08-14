const { GlobalWeekday } = require('../models')

const createGlobalRoomsWeekdays = async () => {
  const existingWeekdays = await GlobalWeekday.findAll()

  const existingDays = new Set(existingWeekdays.map(weekday => weekday.dayOfWeek))

  const allDays = [
    { dayOfWeek: 0, availability: false, timeBegin: null, timeEnd: null },              //Sunday
    { dayOfWeek: 1, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },   //Monday
    { dayOfWeek: 2, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },   //Tuesday
    { dayOfWeek: 3, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },   //Wednesday
    { dayOfWeek: 4, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },   //Thursday
    { dayOfWeek: 5, availability: true, timeBegin: '08:00:00', timeEnd: '16:00:00' },   //Friday
    { dayOfWeek: 6, availability: false, timeBegin: null, timeEnd: null }               //Saturday
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
