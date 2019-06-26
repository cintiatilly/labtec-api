const TypeAccountDomain = require('../../domains/user/typeAccount')
const database = require('../../database')

const typeAccountDomain = new TypeAccountDomain()

const add = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const typeAccount = await typeAccountDomain.add(req.body, { transaction })

    await transaction.commit()
    res.json(typeAccount)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}


module.exports = {
  add,
}
