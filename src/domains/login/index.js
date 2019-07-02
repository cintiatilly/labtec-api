const database = require('../../database')

const SessionDomain = require('./session')

const { UnauthorizedError } = require('../../helpers/errors')
const { FieldValidationError } = require('../../helpers/errors')

const User = database.model('user')
const Login = database.model('login')

const sessionDomain = new SessionDomain()

class LoginDomain {
  async login({ username, password }, options = {}) {
    const { transaction = null } = options

    const login = await Login.findOne({
      include: [{
        model: User,
        where: { username },
      }],
      transaction,
    })

    if (!login) {
      throw new UnauthorizedError()
    }

    const checkPwd = await login.checkPassword(password)

    if (!checkPwd) {
      throw new UnauthorizedError()
    }

    const session = await sessionDomain.createSession(
      login.id,
      { transaction },
    )

    const user = await User.findByPk(
      login.user.id,
      {
        transaction,
        attributes: [
          'id',
          'username',
        ],
      },
    )

    const response = {
      token: session.id,
      userId: user.id,
      username: user.username,
      active: session.active,
    }
    return response
  }

  async logout(token) {
    await sessionDomain.turnInvalidSession(token)

    // const isValid = await sessionDomain.checkSessionIsValid(sessionId)

    // if (isValid) {
    //   throw new FieldValidationError([{
    //     field: 'logout',
    //     message: 'logout failed',
    //   }])
    // }

    const sucess = {
      logout: true,
    }
    return sucess
  }
}

module.exports = LoginDomain
