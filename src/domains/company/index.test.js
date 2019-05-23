const CompanyDomain = require('./')

const { FieldValidationError } = require('../../helpers/errors')

const companyDomain = new CompanyDomain()

describe('companyDomain', () => {
  let companyMock = null

  beforeAll(() => {
    companyMock = {
      razaoSocial: 'teste 123 LTDA',
      cnpj: '40190041000102',
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
    const companyCreated = await companyDomain.add(companyMock)

    expect(companyCreated.razaoSocial).toBe(companyMock.razaoSocial)
    expect(companyCreated.cnpj).toBe(companyMock.cnpj)
    expect(companyCreated.street).toBe(companyMock.street)
    expect(companyCreated.number).toBe(companyMock.number)
    expect(companyCreated.city).toBe(companyMock.city)
    expect(companyCreated.state).toBe(companyMock.state)
    expect(companyCreated.neighborhood).toBe(companyMock.neighborhood)
    expect(companyCreated.zipCode).toBe(companyMock.zipCode)
    expect(companyCreated.telphone).toBe(companyMock.telphone)
    expect(companyCreated.telphone).toBe(companyMock.telphone)

    await expect(companyDomain.add(companyMock))
      .rejects.toThrowError(new FieldValidationError())
  })

  test('getAll', async () => {
    const companies = await companyDomain.getAll()
    expect(companies.rows.length > 0).toBeTruthy()
  })
})
