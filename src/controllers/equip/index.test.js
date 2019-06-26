const request = require('../../helpers/request')

const CompanyDomain = require('../../domains/company')
const EquipTypeDomain = require('../../domains/equip/equipType')

const companyDomain = new CompanyDomain()
const equipTypeDomain = new EquipTypeDomain()

describe('equipController', () => {
  let equipMock = null
  let equipMarkMock = null
  let headers = null
  let params = null

  beforeAll(async () => {
    const companyMock = {
      razaoSocial: 'teste 123456 LTDA',
      cnpj: '17727750000162',
      street: 'jaime rodrigues',
      number: '69',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '09930-210',
      telphone: '(11)0985-4568',
      nameContact: 'jaimeldom',
      email: 'jaime@gmasi.com',
    }

    const companyCreated = await companyDomain.add(companyMock)

    equipMarkMock = {
      type: 'catraca',
      mark: 'Hanry',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    const equipTypeMock = {
      equipMarkId: markMock.id,
      model: 'Henry 8.0',
      description: '',
    }

    const equipModelCreated = await equipTypeDomain.addModel(equipTypeMock)

    equipMock = {
      equipModelId: equipModelCreated.id,
      companyId: companyCreated.id,
      serialNumber: '123456789',
      readerColor: 'Verde',
      details: '',
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

    params = {
      serialNumber: '123456789',
    }
  })

  test('create', async () => {
    const response = await request().post('/api/equip', equipMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.serialNumber).toBe(equipMock.serialNumber)
    expect(body.readerColor).toBe(equipMock.readerColor)
    expect(body.details).toBe(equipMock.details)
    expect(body.company.id).toBe(equipMock.companyId)
    expect(body.equipModel.id).toBe(equipMock.equipModelId)
  })

  test('getall', async () => {
    const response = await request().get('/api/equip', { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.count).toBeTruthy()
    expect(body.page).toBeTruthy()
    expect(body.show).toBeTruthy()
    expect(body.rows).toBeTruthy()
  })

  test('getOneBySerialNumber', async () => {
    const response = await request().get('/api/equip/serialNumber', { headers, params })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.serialNumber).toBeTruthy()
    expect(body.readerColor).toBeTruthy()
    expect(body.equipModelId).toBeTruthy()
    expect(body.companyId).toBeTruthy()
  })
})
