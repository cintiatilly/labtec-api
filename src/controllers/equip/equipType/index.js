const EquipTypeDomain = require('../../../domains/equip/equipType')
const database = require('../../../database')

const equipTypeDomain = new EquipTypeDomain()

const add = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const equipType = await equipTypeDomain.add(req.body, { transaction })

    await transaction.commit()
    res.json(equipType)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

const getAll = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const equipType = await equipTypeDomain.getAll()

    await transaction.commit()
    res.json(equipType)
  } catch (error) {
    await transaction.rollback()
    next()
  }
}

const getAllMarkByType = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const { type = null } = req.query

    const marksArray = await equipTypeDomain.getAllMarkByType(type)

    await transaction.commit()
    res.json(marksArray)
  } catch (error) {
    await transaction.rollback()
    next()
  }
}

const getAllModelByMark = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const { mark = null } = req.query

    const modelArray = await equipTypeDomain.getAllModelByMark(mark)

    await transaction.commit()
    res.json(modelArray)
  } catch (error) {
    await transaction.rollback()
    next()
  }
}

module.exports = {
  add,
  getAll,
  getAllMarkByType,
  getAllModelByMark,
}
