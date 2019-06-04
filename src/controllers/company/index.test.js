const request = require('../../helpers/request')

describe('companyController', () => {
  let companyMock = null
  let headers = null

  beforeAll(async () => {
    companyMock = {
      razaoSocial: 'teste 12sa3 LTDA',
      cnpj: '32478461000160',
      street: 'jadaisom rodrigues',
      number: '6969',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '03265080',
      telphone: '09654568',
      nameContact: 'joseildom',
      email: 'clebinho@joazinho.com',
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
    const response = await request().post('/api/company', companyMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.razaoSocial).toBe(companyMock.razaoSocial)
    expect(body.cnpj).toBe(companyMock.cnpj)
    expect(body.street).toBe(companyMock.street)
    expect(body.number).toBe(companyMock.number)
    expect(body.city).toBe(companyMock.city)
    expect(body.state).toBe(companyMock.state)
    expect(body.neighborhood).toBe(companyMock.neighborhood)
    expect(body.zipCode).toBe(companyMock.zipCode)
    expect(body.telphone).toBe(companyMock.telphone)
  })

  test('getall', async () => {
    const response = await request().get('/api/company', { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.count).toBeTruthy()
    expect(body.page).toBeTruthy()
    expect(body.show).toBeTruthy()
    expect(body.rows).toBeTruthy()
  })

  test('getOneByCnpj', async () => {
    const response = await request().get('/api/company/getOneByCnpj', { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.razaoSocial).toBeTruthy()
    expect(body.cnpj).toBeTruthy()
    expect(body.street).toBeTruthy()
    expect(body.number).toBeTruthy()
    expect(body.city).toBeTruthy()
    expect(body.state).toBeTruthy()
    expect(body.neighborhood).toBeTruthy()
    expect(body.zipCode).toBeTruthy()
    expect(body.telphone).toBeTruthy()
  })
})
