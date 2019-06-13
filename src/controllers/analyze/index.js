const AnalyzeDomain = require('../../domains/analyze')
const database = require('../../database')

const analyzeDomain = new AnalyzeDomain()

const add = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const analyze = await analyzeDomain.add(req.body, { transaction })

    await transaction.commit()
    res.json(analyze)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

module.exports = {
  add,
}
