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
      addEquipType: false,
      tecnico: false,
      addAccessories: false,
      addUser: false,
      addTypeAccount: false,
    }

    await typeAccount.add(typeAccountMock)

    userMock = {
      username: 'teste9',
      typeName: 'RECEPÇAO',
      customized: true,
      addCompany: true,
      addPart: true,
      addAnalyze: true,
      addEquip: true,
      addEntry: true,
      addEquipType: false,
      tecnico: false,
      addAccessories: false,
      addUser: false,
      addTypeAccount: false,
    }

    const loginBody = {
      username: 'modrp',
      password: 'modrp',
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

  test('getResourceByUsername', async () => {
    userMock = {
      username: 'teste97',
      typeName: 'RECEPÇAO',
      customized: true,
      addCompany: true,
      addPart: true,
      addAnalyze: true,
      addEquip: true,
      addEntry: true,
      addEquipType: false,
      tecnico: false,
      addAccessories: false,
      addUser: false,
      addTypeAccount: false,
    }

    await request().post('/api/user', userMock, { headers })

    const params = {
      username: 'teste97',
    }
    const response = await request().get('/api/user/getResourceByUsername', { headers, params })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.addCompany).toBe(userMock.addCompany)
    expect(body.addPart).toBe(userMock.addPart)
    expect(body.addAnalyze).toBe(userMock.addAnalyze)
    expect(body.addEquip).toBe(userMock.addEquip)
    expect(body.addEntry).toBe(userMock.addEntry)
  })
})
