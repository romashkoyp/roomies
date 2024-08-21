const router = require('express').Router()
const Session = require('../models/session')
const { tokenExtractor, isSession, isTokenUser } = require('../util/middleware')

router.delete('/', tokenExtractor, isTokenUser, isSession,
  async (req, res) => {
    await Session.destroy({ where: { user_id: req.tokenUser.id } })
    res.status(204).end()
})

module.exports = router