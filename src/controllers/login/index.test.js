const { generateUser } = require('../../helpers/mockData/user')
const request = require('../../helpers/request')
const UserDomain = require('../../domains/user')

const userDomain = new UserDomain()

describe('/login', () => {
  let userMock = null
  let user = null

  beforeAll(async () => {
    userMock = generateUser('login_controller')
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
      password: userMock.username,
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
})
