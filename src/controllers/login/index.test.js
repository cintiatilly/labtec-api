const request = require('../../helpers/request')
const UserDomain = require('../../domains/user')
const TypeAccount = require('../../domains/user/typeAccount')

const userDomain = new UserDomain()
const typeAccount = new TypeAccount()

describe('logincontroller', () => {
  let user = null
  let userMock = null

  beforeAll(async () => {
    const typeAccountMock = {
      typeName: 'TESTE5',
      addCompany: true,
      addPart: true,
      addAnalyze: true,
      addEquip: true,
      addEntry: true,
    }

    await typeAccount.add(typeAccountMock)

    userMock = {
      username: 'teste5',
      typeName: 'TESTE5',
      customized: false,
      addCompany: true,
      addPart: true,
      addAnalyze: true,
      addEquip: true,
      addEntry: true,
    }

    user = await userDomain.user_Create(userMock)
  })

  test('try login with correct data', async () => {
    const loginBody = {
      username: userMock.username,
      password: userMock.username,
    }

    const response = await request().post('/oapi/login', loginBody)

    expect(response.statusCode).toBe(200)
    expect(response.body.username).toBe(loginBody.username)
    expect(response.body.name).toBe(user.name)
    expect(response.body.userId).toBe(user.id)
    expect(response.body.token).toBeTruthy()
    expect(response.body.email).toBe(user.email)
  })

  test('try login with incorrect username', async () => {
    const loginBody = {
      username: 'naocadastrado1322103',
      password: 'baasdfa',
    }

    const response = await request().post('/oapi/login', loginBody)

    expect(response.statusCode).toBe(401)
    expect(response.body.name).toBe('User UNAUTHORIZED')
  })

  test('try login with incorrect password', async () => {
    const loginBody = {
      password: userMock.username,
      username: 'incorrectpass',
    }

    const response = await request().post('/oapi/login', loginBody)

    expect(response.statusCode).toBe(401)
    expect(response.body.name).toBe('User UNAUTHORIZED')
  })

  test('try login with password equal null', async () => {
    const loginBody = {
      password: userMock.username,
      username: '',
    }

    const response = await request().post('/oapi/login', loginBody)

    expect(response.statusCode).toBe(401)
    expect(response.body.name).toBe('User UNAUTHORIZED')
  })

  test('try login with username equal null', async () => {
    const loginBody = {
      username: '',
      password: userMock.username,
    }

    const response = await request().post('/oapi/login', loginBody)

    expect(response.statusCode).toBe(401)
    expect(response.body.name).toBe('User UNAUTHORIZED')
  })

  test('try login with username omited', async () => {
    const loginBody = {
      password: userMock.username,
    }

    const response = await request().post('/oapi/login', loginBody)

    expect(response.statusCode).toBe(401)
    expect(response.body.name).toBe('User UNAUTHORIZED')
  })

  test('try login with password omited', async () => {
    const loginBody = {
      username: userMock.username,
    }

    const response = await request().post('/oapi/login', loginBody)

    expect(response.statusCode).toBe(401)
    expect(response.body.name).toBe('User UNAUTHORIZED')
  })

  test('logout', async () => {
    const loginBody = {
      username: userMock.username,
      password: userMock.username,
    }

    const response = await request().post('/oapi/login', loginBody)

    const params = {
      token: response.body.token,
    }

    const logout = await request().delete('/oapi/logout', { params })

    expect(logout.statusCode).toBe(200)
    expect(logout.body.logout).toBe(true)
  })
})
