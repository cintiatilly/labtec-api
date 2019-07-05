const router = require('express').Router({ mergeParams: true })
const typeAccountController = require('../../controllers/typeAccount')

router.post('', typeAccountController.add)
router.get('', typeAccountController.getAll)

module.exports = router
