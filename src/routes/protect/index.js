const router = require('express').Router({ mergeParams: true })
const companyRoute = require('./company')
const equipTypeRoute = require('./equipType')
const equipRoute = require('./equip')
const entryEquipmentRoute = require('./entryEquipment')
const partRoute = require('./part')
const analyzeRoute = require('./analyze')
const processRoute = require('./process')
const typeAccountRoute = require('./typeAccount')
const userRoute = require('./user')


router.use('/company', companyRoute)
router.use('/equip/equipType', equipTypeRoute)
router.use('/equip', equipRoute)
router.use('/entryEquipment', entryEquipmentRoute)
router.use('/part', partRoute)
router.use('/analyze', analyzeRoute)
router.use('/process', processRoute)
router.use('/typeAccount', typeAccountRoute)
router.use('/user', userRoute)

module.exports = router
