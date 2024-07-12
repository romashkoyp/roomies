const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SECRET } = require('../util/config')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: { username: body.username }
   })
   
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    throw new Error('Invalid username or password')
  }

  if (user.enabled === false) {
    throw new Error('Account disabled')
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(
    userForToken,
    SECRET,
    { expiresIn: 60*60 }
  )

  res
    .status(200)
    .send({ token, id: user.id, username: user.username, name: user.name })
})

module.exports = router