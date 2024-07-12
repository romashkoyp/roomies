const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (req.body) {
    if (!username || !name || !password) {
      throw new Error('All fields are required')
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      username,
      name,
      passwordHash,
    })

    console.log('New user created')
    res.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name
    })  
  } else {
    throw new Error('User not created')
  }
})

module.exports = router