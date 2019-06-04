const EntryEquipmentDomain = require('../../domains/entryEquipment')
const database = require('../../database')

const entryEquipmentDomain = new EntryEquipmentDomain()

const add = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const equip = await entryEquipmentDomain.add(req.body, { transaction })

    await transaction.commit()
    res.json(equip)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

module.exports = {
  add,
}
