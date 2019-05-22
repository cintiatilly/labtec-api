const router = require('express').Router({ mergeParams: true })
const loginController = require('../controllers/login')

router.post('/login', loginController.loginController)

module.exports = router
