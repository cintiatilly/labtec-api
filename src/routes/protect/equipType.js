const router = require('express').Router({ mergeParams: true })
const equipTypeController = require('../../controllers/equip/equipType')


router.get('', equipTypeController.getAll)
router.post('', equipTypeController.add)
router.get('/getAllMarkByType', equipTypeController.getAllMarkByType)
router.get('/getAllModelByMark', equipTypeController.getAllModelByMark)


module.exports = router
