const router = require('express').Router({ mergeParams: true })
const typeAccountController = require('../../controllers/typeAccount')

router.post('', typeAccountController.add)

module.exports = router
