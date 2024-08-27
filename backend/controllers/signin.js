const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SECRET } = require('../util/config')
const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/',
  body('username')
    .notEmpty().withMessage('Username is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 1 }).withMessage('Please enter your password'),

  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

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

    await Session.create({
      userId: user.id,
      token
    })

    res
      .status(200)
      .send({
        token,
        id: user.id,
        username: user.username,
        name: user.name
      })
  })

module.exports = router