const router = require('express').Router()
const loginController = require('../controllers/login')

router.post('/login', loginController.loginController)

module.exports = router
