const router = require('express').Router({ mergeParams: true })
const companyController = require('../../controllers/company')


router.get('', companyController.getAll)
router.post('', companyController.add)
router.put('/update', companyController.update)
router.get('/getOneByCnpj', companyController.getOneByCnpj)


module.exports = router
