const router = require('express').Router({ mergeParams: true })
const userController = require('../../controllers/user')


router.post('', userController.add)

module.exports = router
