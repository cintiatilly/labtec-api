const router = require('express').Router({ mergeParams: true })
const loginController = require('../controllers/login')

router.post('/login', loginController.loginController)
router.delete('/logout', loginController.logoutController)

module.exports = router
