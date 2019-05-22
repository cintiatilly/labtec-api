const R = require('ramda')

const LoginDomain = require('./')
const UserDomain = require('../user')
const SessionDomain = require('./session')

const { generateUser } = require('../../helpers/mockData/user')
const { UnauthorizedError } = require('../../helpers/errors')

const loginDomain = new LoginDomain()
const userDomain = new UserDomain()
const sessionDomain = new SessionDomain()

describe('login-domain', () => {
  describe('logOnTest', () => {
    let userCreated = {}
    let counter = 0

    beforeEach(async () => {
      const userMock = generateUser(`login_domain${counter}`)
      counter += 1
      userCreated = await userDomain.user_Create(userMock)
    })

    test('try login with correct account', async () => {
      const getUserLoginMock = R.applySpec({
        username: R.prop('username'),
        password: R.prop('username'),
      })

      const userLogin = getUserLoginMock(userCreated)

      const session = await loginDomain.login(userLogin)

      expect(session.id).not.toBeNull()
    })

    test('try login with incorrect password', async () => {
      const getUserLoginMock = R.applySpec({
        username: R.prop('username'),
      })

      let userLogin = getUserLoginMock(userCreated)

      userLogin = {
        ...userLogin,
        password: 'abcs',
      }

      await expect(loginDomain.login(userLogin))
        .rejects.toThrowError(new UnauthorizedError())
    })

    test('try login with user not registered', async () => {
      const userLogin = {
        username: 'userNaoCadastrado',
        password: 'abcs',
      }

      await expect(loginDomain.login(userLogin))
        .rejects.toThrowError(new UnauthorizedError())
    })
  })

  describe('logoutTest', () => {
    let counter = 0
    let loginResponse = {}
    let userLogin = {}

    beforeEach(async () => {
      const userMock = generateUser(`logout_domain${counter}`)
      counter += 1
      const userCreated = await userDomain.user_Create(userMock)

      const getUserLoginMock = R.applySpec({
        username: R.prop('username'),
        password: R.prop('username'),
      })

      userLogin = getUserLoginMock(userCreated)

      loginResponse = await loginDomain.login(userLogin)
    })

    test('try logout', async () => {
      const logoutSucess = await loginDomain.logout(loginResponse.token)

      const sucess = {
        logout: true,
      }

      expect(logoutSucess).toEqual(sucess)
    })

    test('try logout all sessions', async () => {
      const session2 = await loginDomain.login(userLogin)
      const session3 = await loginDomain.login(userLogin)
      const session4 = await loginDomain.login(userLogin)
      const session5 = await loginDomain.login(userLogin)

      await loginDomain.logoutAllSessions(userLogin.username)

      const isValid1 = await sessionDomain
        .checkSessionIsValid(loginResponse.token, userLogin.username)

      const isValid2 = await sessionDomain
        .checkSessionIsValid(session2.token, userLogin.username)

      const isValid3 = await sessionDomain
        .checkSessionIsValid(session3.token, userLogin.username)

      const isValid4 = await sessionDomain
        .checkSessionIsValid(session4.token, userLogin.username)

      const isValid5 = await sessionDomain
        .checkSessionIsValid(session5.token, userLogin.username)

      expect(isValid1).toBeFalsy()
      expect(isValid2).toBeFalsy()
      expect(isValid3).toBeFalsy()
      expect(isValid4).toBeFalsy()
      expect(isValid5).toBeFalsy()
    })
  })
})

describe('Session Domains Tests', () => {
  let loginResponse = {}
  let counter = 0
  let username = null

  beforeEach(async () => {
    const userMock = generateUser(`session_domain${counter}`)
    counter += 1
    const userCreated = await userDomain.user_Create(userMock)
    const getUserLoginMock = R.applySpec({
      username: R.prop('username'),
      password: R.prop('username'),
    })

    const userLogin = getUserLoginMock(userCreated)

    // eslint-disable-next-line prefer-destructuring
    username = userCreated.username

    loginResponse = await loginDomain.login(userLogin)
  })

  test('try create session', async () => {
    expect(loginResponse.token).not.toBeNull()
  })

  // test('try update last Activity', async () => {
  //   const sessionUpdated = await sessionDomain
  //     .updateLastActivity(loginResponse.token)

  //   const oldLastActivity = sessionUpdated.lastActivity
  //   const newLastActivity = sessionUpdated.lastActivity

  //   expect(newLastActivity > oldLastActivity).toBeTruthy()
  // })

  test('try check validate of new session', async () => {
    const isValid = await sessionDomain
      .checkSessionIsValid(loginResponse.token, username)

    expect(isValid).toBeTruthy()
  })

  test('try turn invalid new session', async () => {
    let isValid = await sessionDomain
      .checkSessionIsValid(loginResponse.token, username)

    expect(isValid).toBeTruthy()

    await sessionDomain.turnInvalidSession(loginResponse.token)

    isValid = await sessionDomain
      .checkSessionIsValid(loginResponse.token, username)

    expect(isValid).toBeFalsy()
  })
})
