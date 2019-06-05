const router = require('express').Router({ mergeParams: true })
const entryEquipmentController = require('../../controllers/entryEquipment')


router.post('', entryEquipmentController.add)

module.exports = router
