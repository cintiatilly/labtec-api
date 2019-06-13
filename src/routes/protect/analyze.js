const router = require('express').Router({ mergeParams: true })
const analyzeController = require('../../controllers/analyze')
const analysisPartController = require('../../controllers/analyze/analysisPart')


// router.get('', analyzeController.getAll)
router.post('', analyzeController.add)
router.post('/analysisPart', analysisPartController.add)
// router.get('/getOneByCnpj', analyzeController.getOneByCnpj)


module.exports = router
