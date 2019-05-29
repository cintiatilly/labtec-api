const router = require('express').Router({ mergeParams: true })
const equipTypeController = require('../../controllers/equip/equipType')


router.get('', equipTypeController.getAll)
router.post('', equipTypeController.add)

module.exports = router
