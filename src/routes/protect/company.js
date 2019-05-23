const router = require('express').Router({ mergeParams: true })
const companyController = require('../../controllers/company')


router.get('', companyController.getAll)
router.post('', companyController.add)

module.exports = router
