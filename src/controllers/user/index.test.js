const request = require('../../helpers/request')

const TypeAccount = require('../../domains/user/typeAccount')

const typeAccount = new TypeAccount()


describe('userController', () => {
  let headers = null
  let typeAccountMock = null
  let userMock = null

  beforeAll(async () => {
    typeAccountMock = {
      typeName: 'RECEPÇAO',
      addCompany: true,
      addPart: true,
      addAnalyze: true,
      addEquip: false,
      addEntry: false,
    }

    const typeAccountCreate = await typeAccount.add(typeAccountMock)

    userMock = {
      username: 'teste9',
      typeAccountId: typeAccountCreate.id,
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
    const response = await request().post('/api/user', userMock, { headers })

    const { body, statusCode } = response
    
    expect(statusCode).toBe(200)
    // expect(body.typeName).toBe(typeAccountMock.typeName)
    // expect(body.resource.addCompany).toBe(typeAccountMock.addCompany)
    // expect(body.resource.addPart).toBe(typeAccountMock.addPart)
    // expect(body.resource.addAnalyze).toBe(typeAccountMock.addAnalyze)
    // expect(body.resource.addEquip).toBe(typeAccountMock.addEquip)
    // expect(body.resource.addEntry).toBe(typeAccountMock.addEntry)
  })
})
