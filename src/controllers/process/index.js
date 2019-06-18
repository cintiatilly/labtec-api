const ProcessDomain = require('../../domains/process')
const database = require('../../database')

const processDomain = new ProcessDomain()

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const { id = null } = req.body
    const { updateProcessMock = null } = req.body

    const process = await processDomain.update(id,
      updateProcessMock,
      { transaction })

    await transaction.commit()
    res.json(process)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

module.exports = {
  update,
}
