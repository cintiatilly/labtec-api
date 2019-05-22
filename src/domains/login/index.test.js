const LoginDomain = require('./')
const UserDomain = require('../user')

const { UnauthorizedError } = require('../../helpers/errors')

const loginDomain = new LoginDomain()
const userDomain = new UserDomain()

describe('loginDomain', () => {
  test('try login with correct account', async () => {
    const userMock = {
      username: 'teste2',
      type: 'tecnico',
    }

    await userDomain.user_Create(userMock)

    const userLogin = {
      username: 'teste2',
      password: 'teste2',
    }

    const session = await loginDomain.login(userLogin)

    expect(session.id).not.toBeNull()
  })

  test('try login with incorrect password', async () => {
    const userLogin = {
      username: 'teste2',
      password: 'teste5',
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
  test('try logout', async () => {
    const userMock = {
      username: 'teste3',
      type: 'tecnico',
    }
    await userDomain.user_Create(userMock)

    const userLogin = {
      username: 'teste3',
      password: 'teste3',
    }

    const session = await loginDomain.login(userLogin)

    const logoutSucess = await loginDomain.logout(session.token)

    const sucess = {
      logout: true,
    }

    expect(logoutSucess).toEqual(sucess)
  })
})
