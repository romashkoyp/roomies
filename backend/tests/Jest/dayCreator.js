const { format, addDays, getDay } = require('date-fns')

const dayCreator = async () => {
  const today = new Date()
  
  const tomorrow = format(addDays(today, 1), 'yyyy-MM-dd')
  const second = format(addDays(today, 2), 'yyyy-MM-dd')
  const third = format(addDays(today, 3), 'yyyy-MM-dd')

  const dTomorrow = getDay(addDays(today, 1))
  const dSecond = getDay(addDays(today, 2))
  const dThird = getDay(addDays(today, 3))

  return {
    tomorrow,
    dTomorrow,
    second,
    dSecond,
    third,
    dThird,
  }
}

module.exports = { dayCreator }


/*const dayCreator = async () => {
  // Create tomorrow date
  const rawToday = new Date()
  const rawTomorrow = new Date(rawToday.getTime() + 24 * 60 * 60 * 1000)

  const yearTomorrow = rawTomorrow.getFullYear()
  const monthTomorrow = String(rawTomorrow.getMonth() + 1).padStart(2, '0')
  const dayTomorrow = String(rawTomorrow.getDate()).padStart(2, '0')
  const tomorrow = `${yearTomorrow}-${monthTomorrow}-${dayTomorrow}`
  const dayOfWeekNumberTomorrow = rawTomorrow.getDay()

  // Create the day after tomorrow
  const rawDayAfterTomorrow = new Date(rawTomorrow.getTime() + 24 * 60 * 60 * 1000)

  const yearDayAfterTomorrow = rawDayAfterTomorrow.getFullYear()
  const monthDayAfterTomorrow = String(rawDayAfterTomorrow.getMonth() + 1).padStart(2, '0')
  const dayDayAfterTomorrow = String(rawDayAfterTomorrow.getDate()).padStart(2, '0')
  const dayAfterTomorrow = `${yearDayAfterTomorrow}-${monthDayAfterTomorrow}-${dayDayAfterTomorrow}`
  const dayOfWeekNumberDayAfterTomorrow = rawDayAfterTomorrow.getDay()

  // Create the second day after tomorrow
  const rawSecondDayAfterTomorrow = new Date(rawDayAfterTomorrow.getTime() + 24 * 60 * 60 * 1000)

  const yearSecondDayAfterTomorrow = rawSecondDayAfterTomorrow.getFullYear()
  const monthSecondDayAfterTomorrow = String(rawSecondDayAfterTomorrow.getMonth() + 1).padStart(2, '0')
  const daySecondDayAfterTomorrow = String(rawSecondDayAfterTomorrow.getDate()).padStart(2, '0')
  const secondDayAfterTomorrow = `${yearSecondDayAfterTomorrow}-${monthSecondDayAfterTomorrow}-${daySecondDayAfterTomorrow}`
  const dayOfWeekNumberSecondDayAfterTomorrow = rawSecondDayAfterTomorrow.getDay()

  console.log('Raw Today:', rawToday)
  console.log('Raw Tomorrow:', rawTomorrow)
  console.log('Tomorrow:', tomorrow)
  console.log('Day of the Week (Tomorrow):', dayOfWeekNumberTomorrow)

  console.log('Raw Day After Tomorrow:', rawDayAfterTomorrow)
  console.log('Day After Tomorrow:', dayAfterTomorrow)
  console.log('Day of the Week (Day After Tomorrow):', dayOfWeekNumberDayAfterTomorrow)

  console.log('Raw Second Day After Tomorrow:', rawSecondDayAfterTomorrow)
  console.log('Second Day After Tomorrow:', secondDayAfterTomorrow)
  console.log('Day of the Week (Second Day After Tomorrow):', dayOfWeekNumberSecondDayAfterTomorrow)

  // Return the calculated dates
  return {
    tomorrow,
    dayOfWeekNumberTomorrow,
    dayAfterTomorrow,
    dayOfWeekNumberDayAfterTomorrow,
    secondDayAfterTomorrow,
    dayOfWeekNumberSecondDayAfterTomorrow,
  }
}

module.exports = { dayCreator }*/