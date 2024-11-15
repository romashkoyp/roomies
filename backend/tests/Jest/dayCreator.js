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