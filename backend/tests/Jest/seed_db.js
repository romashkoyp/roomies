const { User, Notification } = require('../../models')

const initialUsers = [
  { 
    username: 'user1@example.com', 
    name: 'User 1', 
    passwordHash: '$2a$10$jL.m3.tM1jEK7M/K62..6eU6/j4y25/A9hWZ.vOqrg.tDk7ZQcC3G',
    admin: false,
    enabled: true
  },
  {
    username: 'user2@example.com', 
    name: 'User 2', 
    passwordHash: '726mU3W6q$ja/K..$L/k45.9GMe2Q71/K2j$cg.6t.Z0yMZCAOjt3Dv.rh1E',
    admin: false,
    enabled: true
  },
  {
    username: 'user3@example.com', 
    name: 'User 3', 
    passwordHash: 'j/W$7M.59re/c6M3G6q7m4v2yjQkt/1h2OKjaA2.g..ECtKZ1D.L63$0Z.$U',
    admin: false,
    enabled: false
  }
]

const initialNotifications = [
  {
    content: 'Test notification 1',
    userId: 1
  },
  {
    content: 'Test notification 2',
    userId: 1
  },
  {
    content: 'Another test notification',
    userId: 2
  }
]

const seedDatabase = async () => {
  try {
    await User.sync({ force: true })
    await Notification.sync({ force: true })

    await User.bulkCreate(initialUsers)
    await Notification.bulkCreate(initialNotifications)

    console.log('Test data seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

const clearDatabase = async () => {
  try {
    await Notification.drop({ cascade: true })
    await User.drop({ cascade: true })
    console.log('Test database cleared!')
  } catch (error) {
    console.error('Error clearing database:', error)
  }
}

module.exports = {
  seedDatabase,
  clearDatabase,
  initialUsers,
  initialNotifications
}