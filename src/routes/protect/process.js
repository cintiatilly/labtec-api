const router = require('express').Router({ mergeParams: true })
const processController = require('../../controllers/process')


router.put('/update', processController.update)
router.get('', processController.getAll)

module.exports = router
