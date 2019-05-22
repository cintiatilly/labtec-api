const LoginDomain = require('../../domains/login')
const database = require('../../database')
const { UnauthorizedError } = require('../../helpers/errors')

const loginDomain = new LoginDomain()

const loginController = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const login = await loginDomain.login(req.body, { transaction })

    await transaction.commit()
    res.json(login)
  } catch (error) {
    await transaction.rollback()
    next(new UnauthorizedError())
  }
}

module.exports = {
  loginController,
}
