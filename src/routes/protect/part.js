const router = require('express').Router({ mergeParams: true })
const partController = require('../../controllers/part')


router.post('', partController.add)
router.put('/updateByCostPrince', partController.updateByCostPrince)
router.put('/updateBySalePrice', partController.updateBySalePrice)


module.exports = router
