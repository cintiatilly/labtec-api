const UserDomain = require('../../domains/user')
const database = require('../../database')

const userDomain = new UserDomain()


const add = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const user = await userDomain.user_Create(req.body, { transaction })

    await transaction.commit()
    res.json(user)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}


module.exports = {
  add,
}
