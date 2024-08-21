const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { body, validationResult } = require('express-validator')

router.post('/',
  body('username')
    .notEmpty().withMessage('Username is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 1 }).withMessage('Please enter your name'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match')
      return true
    }),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const validationError = new Error('Validation failed')
      validationError.errors = errors.array()
      throw validationError
    }

    const { username, name, password } = req.body

    if (req.body) {
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