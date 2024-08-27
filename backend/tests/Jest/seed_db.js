const { User, Notification, Session, Room, GlobalWeekday, GlobalDate, IndividualDate, Booking } = require('../../models')
const { passwordHash } = require('../../util/middleware')
const { dayCreator } = require('../Jest/dayCreator')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../../util/config')

const initialUsers = [
  {
    id: 10,
    username: 'testadmin@admin.com',
    name: 'TestAdmin',
    password: 'pd8$r,Ch',
    admin: true,
    enabled: true
  },
  {
    id: 20,
    username: 'user1@example.com',
    name: 'User 1',
    password: 'pdCh8,$r',
    admin: false,
    enabled: true
  },
  {
    id: 30,
    username: 'user2@example.com',
    name: 'User 2',
    password: 'pdC8,$rh',
    admin: false,
    enabled: true
  },
  {
    id: 40,
    username: 'user3@example.com',
    name: 'User 3',
    password: 'pd,C8$rh',
    admin: false,
    enabled: false
  },
  {
    id: 50,
    username: 'disabledadmin@admin.com',
    name: 'DisabledAdmin',
    password: 'pdr,Ch8$',
    admin: true,
    enabled: false
  },
  {
    id: 60,
    username: 'user4@example.com',
    name: 'User 4',
    password: 'p$d,C8rh',
    admin: false,
    enabled: true
  }
]

const initialNotifications = [
  {
    id: 10,
    content: 'Test notification 1',
    userId: 10
  },
  {
    id: 20,
    content: 'Test notification 2',
    userId: 10
  },
  {
    id: 30,
    content: 'Another test notification',
    userId: 10
  }
]

const initialRooms = [
  {
    id: 10,
    name: 'Air',
    capacity: 10,
    size: 50,
    imagePath: '/images/air.jpeg',
    userId: 10
  },
  {
    id: 20,
    name: 'Forest',
    capacity: 20,
    size: 70,
    imagePath: '/images/forest.jpeg',
    userId: 10
  }
]

const initialGlobalWeekdays = [
  {
    id: 10,
    dayOfWeek: 0,
    availability: false,
    timeBegin: null,
    timeEnd: null
  },
  {
    id: 20,
    dayOfWeek: 1,
    availability: true,
    timeBegin: '08:00:00',
    timeEnd: '16:00:00'
  },
  {
    id: 30,
    dayOfWeek: 2,
    availability: true,
    timeBegin: '08:00:00',
    timeEnd: '16:00:00'
  },
  {
    id: 40,
    dayOfWeek: 3,
    availability: true,
    timeBegin: '08:00:00',
    timeEnd: '16:00:00'
  },
  {
    id: 50,
    dayOfWeek: 4,
    availability: true,
    timeBegin: '08:00:00',
    timeEnd: '16:00:00'
  },
  {
    id: 60,
    dayOfWeek: 5,
    availability: true,
    timeBegin: '08:00:00',
    timeEnd: '16:00:00'
  },
  {
    id: 70,
    dayOfWeek: 6,
    availability: false,
    timeBegin: null,
    timeEnd: null
  },
]

async function initializeVariables() {
  const { tomorrow, dTomorrow, second, dSecond } = await dayCreator()

  const initialGlobalDates = [
    {
      id: 10,
      date: tomorrow,
      name: 'Global Holiday',
      availability: false,
      timeBegin: null,
      timeEnd: null,
      dayOfWeek: dTomorrow
    },
    {
      id: 20,
      date: second,
      name: 'Global Holiday 2',
      availability: false,
      timeBegin: null,
      timeEnd: null,
      dayOfWeek: dSecond
    },
  ]

  const initialIndividualDates = [
    {
      id: 10,
      date: tomorrow,
      availability: true,
      name: 'Individual work day',
      timeBegin: '10:00:00',
      timeEnd: '14:00:00',
      dayOfWeek: dTomorrow,
      roomId: 10
    },
    {
      id: 20,
      date: tomorrow,
      availability: true,
      name: 'Second work day',
      timeBegin: '09:00:00',
      timeEnd: '15:00:00',
      dayOfWeek: dTomorrow,
      roomId: 20
    }
  ]

  const initialBookings = [
    {
      id: 10,
      name: 'New booking by User 1',
      date: tomorrow,
      timeBegin: '10:00:00',
      timeEnd: '11:00:00',
      roomId: 10,
      userId: 20
    },
    {
      id: 20,
      name: 'New booking by User 2',
      date: tomorrow,
      timeBegin: '12:00:00',
      timeEnd: '13:00:00',
      roomId: 10,
      userId: 30
    }
  ]

  return {
    initialGlobalDates,
    initialIndividualDates,
    initialBookings
  }
}

const seedDatabase = async () => {
  try {
    const { initialGlobalDates, initialIndividualDates, initialBookings } = await initializeVariables()

    await User.sync({ force: true })
    const usersWithHashedPasswords = await Promise.all(initialUsers.map(async (user) => {
      const hashedPassword = await passwordHash(user.password)
      return { ...user, passwordHash: hashedPassword, password: undefined }
    }))
    await User.bulkCreate(usersWithHashedPasswords)

    await Notification.sync({ force: true }) //order make sense!!!!!!!!
    await Notification.bulkCreate(initialNotifications)

    await Room.sync({ force: true })
    await Room.bulkCreate(initialRooms)

    await GlobalWeekday.sync({ force: true })
    await GlobalWeekday.bulkCreate(initialGlobalWeekdays)

    await GlobalDate.sync({ force: true })
    await GlobalDate.bulkCreate(initialGlobalDates)

    await IndividualDate.sync({ force: true })
    await IndividualDate.bulkCreate(initialIndividualDates)

    await Booking.sync({ force: true })
    await Booking.bulkCreate(initialBookings)

    await Session.sync({ force: true })
    const sessions = await Promise.all(initialUsers.map(async (user) => {
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET)
      return { userId: user.id, token }
    }))
    await Session.bulkCreate(sessions)

    console.log('Test data seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

const clearDatabase = async () => {
  try {
    await Notification.drop({ cascade: true })
    await Room.drop({ cascade: true })
    await GlobalWeekday.drop({ cascade: true })
    await GlobalDate.drop({ cascade: true })
    await IndividualDate.drop({ cascade: true })
    await Booking.drop({ cascade: true })
    await User.drop({ cascade: true })
    await Session.drop({ cascade: true })
    console.log('Test database cleared!')
  } catch (error) {
    console.error('Error clearing database:', error)
    throw error
  }
}

module.exports = {
  seedDatabase,
  clearDatabase,
  initialUsers,
  initialNotifications,
  initialRooms,
  initialGlobalWeekdays
}