const router = require('express').Router()
const User = require('../models/user')
const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (user.enabled === false) {
    throw new Error('Account disabled')
  }

  if (user) {
    await Session.destroy({ where: { userId: user.id } })
    res.status(204).end()
  } else {
    throw new Error('User not found')
  }
})

module.exports = router