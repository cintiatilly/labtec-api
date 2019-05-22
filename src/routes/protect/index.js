const router = require('express').Router({ mergeParams: true })
const companyRoute = require('./company')

router.use('/company', companyRoute)

module.exports = router
