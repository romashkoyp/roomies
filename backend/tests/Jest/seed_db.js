const { User, Notification } = require('../../models')
const { passwordHash } = require('../../util/middleware')
const { sequelize } = require('../../util/db')

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

const seedDatabase = async () => {
  try {
    await User.sync({ force: true })
    const usersWithHashedPasswords = await Promise.all(initialUsers.map(async (user) => {
      const hashedPassword = await passwordHash(user.password)
      return { ...user, passwordHash: hashedPassword, password: undefined }
    }))
    await User.bulkCreate(usersWithHashedPasswords)
    
    await Notification.sync({ force: true }) //order make sense!!!!!!!!
    await Notification.bulkCreate(initialNotifications)

    console.log('Test data seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

const clearDatabase = async () => {
  try {
    await Notification.drop({ cascade: true })
    await User.drop({ cascade: true })
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
  initialNotifications
}