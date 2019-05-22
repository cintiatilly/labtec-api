const R = require('ramda')

const database = require('../../database')

const SessionDomain = require('./session')

const { UnauthorizedError } = require('../../helpers/errors')
const { FieldValidationError } = require('../../helpers/errors')

const User = database.model('user')
const Login = database.model('login')
const Session = database.model('session')

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
          'name',
          'username',
          'email',
        ],
      },
    )

    const response = {
      token: session.id,
      userId: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    }

    return response
  }

  async logout(sessionId) {
    await sessionDomain.turnInvalidSession(sessionId)

    const isValid = await sessionDomain.checkSessionIsValid(sessionId)

    if (isValid) {
      throw new FieldValidationError([{
        field: 'logout',
        message: 'logout failed',
      }])
    }

    const sucess = {
      logout: true,
    }
    return sucess
  }

  async logoutAllSessions(username, options = {}) {
    const { transaction = null } = options

    const login = await Login.findOne({
      include: [{
        model: User,
        where: { username },
      }],
      transaction,
    })

    const allSessionsList = await Session
      .findAndCountAll({
        where: {
          loginId: login.id,
        },
      })

    const { count } = allSessionsList
    const { rows } = allSessionsList

    const sessionsIds = rows.map(currentSession => currentSession.id)

    sessionsIds.map(
      async sessionId => sessionDomain
        .turnInvalidSession(sessionId),
    )

    const sucessList = sessionsIds.map(
      async sessionId => sessionDomain
        .checkSessionIsValid(sessionId),
    )

    const checkSucess = R.reduce((acc, value) => acc || value, false)

    const sucess = checkSucess(sucessList)

    const response = {
      count,
      sucess: false,
    }

    if (!sucess) {
      response.sucess = true
    } else {
      response.sucess = false
    }

    return response
  }
}

module.exports = LoginDomain
