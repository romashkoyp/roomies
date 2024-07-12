const router = require('express').Router()
const { User, Notification } = require('../models')

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id)
  if (!req.user) {
    throw new Error('User not found')
  }
  next()
}

const excludePasswordHash = (user) => {
  const { passwordHash, ...userWithoutPassword } = user.toJSON()
  return userWithoutPassword
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Notification,
      attributes: { exclude: ['userId'] }
    }
  })

  if (Array.isArray(users) && users.length !== 0) {
    res.json(users)
  } else {
    throw new Error ('No users found')
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

    if (req.body.enabled !== undefined) {
      req.user.enabled = req.body.enabled
      await req.user.save()
      console.log('Users\'s status updated')
    }
  } else {
    throw new Error ('User not updated')
  }

  res.status(201).json(excludePasswordHash(req.user))
})

router.get('/:id', userFinder, async (req, res) => {
  console.log(req.user.toJSON())
  res.status(201).json(excludePasswordHash(req.user))
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