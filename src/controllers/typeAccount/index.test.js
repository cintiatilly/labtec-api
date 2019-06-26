const request = require('../../helpers/request')

describe('typeAccountController', () => {
  let headers = null
  let typeAccountMock = null

  beforeAll(async () => {
    typeAccountMock = {
      typeName: 'ADM',
      addCompany: true,
      addPart: false,
      addAnalyze: true,
      addEquip: true,
      addEntry: true,
    }

    const loginBody = {
      username: 'modrp',
      password: '102030',
    }

    const login = await request().post('/oapi/login', loginBody)

    const { token, username } = login.body

    headers = {
      token,
      username,
    }
  })

  test('create', async () => {
    const response = await request().post('/api/typeAccount', typeAccountMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.typeName).toBe(typeAccountMock.typeName)
    expect(body.resource.addCompany).toBe(typeAccountMock.addCompany)
    expect(body.resource.addPart).toBe(typeAccountMock.addPart)
    expect(body.resource.addAnalyze).toBe(typeAccountMock.addAnalyze)
    expect(body.resource.addEquip).toBe(typeAccountMock.addEquip)
    expect(body.resource.addEntry).toBe(typeAccountMock.addEntry)
  })
})
