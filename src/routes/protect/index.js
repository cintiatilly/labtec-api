const router = require('express').Router({ mergeParams: true })
const companyRoute = require('./company')
const equipTypeRoute = require('./equipType')
const equipRoute = require('./equip')


router.use('/company', companyRoute)
router.use('/equip/equipType', equipTypeRoute)
router.use('/equip', equipRoute)

module.exports = router
