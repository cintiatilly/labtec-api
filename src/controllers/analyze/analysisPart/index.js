const AnalysisPartDomain = require('../../../domains/analyze/analysisPart')
const database = require('../../../database')

const analysisPartDomain = new AnalysisPartDomain()

const add = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const analysisPart = await analysisPartDomain.add(req.body, { transaction })

    await transaction.commit()
    res.json(analysisPart)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

module.exports = {
  add,
}
