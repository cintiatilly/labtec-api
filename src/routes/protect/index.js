const router = require('express').Router({ mergeParams: true })
const companyRoute = require('./company')
const equipTypeRoute = require('./equipType')

router.use('/company', companyRoute)
router.use('/equip/equipType', equipTypeRoute)

module.exports = router
