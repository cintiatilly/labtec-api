const request = require('../../helpers/request')

describe('companyController', () => {
  let companyMock = null

  beforeAll(() => {
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
    }
  })

  test('create', async () => {
    const response = await request().post('/api/company', companyMock)

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
    expect(body.telphone).toBe(companyMock.telphone)
  })
})
