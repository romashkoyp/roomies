const router = require('express').Router()
const { User } = require('../models')

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id)
  if (!req.user) {
    throw new Error('User not found')
  }
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll()

  if (Array.isArray(users) && users.length !== 0) {
    res.json(users)
  } else {
    throw new Error ('No users found')
  }
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  if (user) {
    console.log(user.toJSON())
    res.status(201).json(user)
  } else {
    res.status(400).json({ error })
  }
})

router.put('/:id', userFinder, async (req, res) => {
  if (req.body) {
    if (req.body.username) {
      req.user.username = req.body.username
      await req.user.save()
      console.log('Username updated')
    }

    if (req.body.name) {
      req.user.name = req.body.name
      await req.user.save()
      console.log('Name updated')
    }

    if (req.body.admin !== undefined) {
      req.user.admin = req.body.admin
      await req.user.save()
      console.log('Admin rights updated')
    }
  } else {
    throw new Error ('User not updated')
  }

  res.status(201).json(req.user)
})

router.get('/:id', userFinder, async (req, res) => {
  console.log(req.user.toJSON())
  res.status(201).json(req.user)
})

router.delete('/:id', userFinder, async (req, res) => {
  try {
    await req.user.destroy()
    console.log('User deleted')
    res.status(204).end()
  } catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router