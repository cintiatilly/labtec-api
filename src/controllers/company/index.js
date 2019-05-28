const CompanyDomain = require('../../domains/company')
const database = require('../../database')

const companyDomain = new CompanyDomain()

const add = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const company = await companyDomain.add(req.body, { transaction })

    await transaction.commit()
    res.json(company)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

const getAll = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const company = await companyDomain.getAll()

    await transaction.commit()
    res.json(company)
  } catch (error) {
    await transaction.rollback()
    next()
  }
}

module.exports = {
  add,
  getAll,
}
