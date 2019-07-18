const request = require('../../helpers/request')

const EntryEquipmentDomain = require('../../domains/entryEquipment')
const CompanyDomain = require('../../domains/company')
const EquipTypeDomain = require('../../domains/equip/equipType')
const EquipDomain = require('../../domains/equip')

const entryEquipmentDomain = new EntryEquipmentDomain()
const companyDomain = new CompanyDomain()
const equipTypeDomain = new EquipTypeDomain()
const equipDomain = new EquipDomain()

describe('processcontroller', () => {
  let headers = null
  let bodyData = null
  let updateProcessMock = null
  let entry = null
  let entryEquipmentMock = null
  let companyMock = null
  let equipMarkMock = null
  let equipMock = null

  beforeAll(async () => {
    entryEquipmentMock = {
      serialNumber: '2564545',
      externalDamage: true,
      details: 'tá zuado',
      defect: 'fonte',
      delivery: 'externo',
      technicianName: 'Jose',
      properlyPacked: true,
      conditionType: 'avulso',
      garantia: 'externo',
    }
    companyMock = {
      razaoSocial: 'Real teste 321/ .LTDA',
      cnpj: '02685203000194',
      street: 'jadaisom rodrigues',
      number: '69',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '09930-210',
      telphone: '(11)8565-4658',
      nameContact: 'jose',
      email: 'jose@gmail.com',
    }

    const companyCreated = await companyDomain.add(companyMock)

    equipMarkMock = {
      type: 'catraca',
      mark: 'LRG',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    const equipTypeMock = {
      equipMarkId: markMock.id,
      model: 'LRG 7.0',
      description: '',
    }


    const equipModelCreated = await equipTypeDomain.addModel(equipTypeMock)

    equipMock = {
      equipModelId: equipModelCreated.id,
      companyId: companyCreated.id,
      serialNumber: '2564545',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    entry = await entryEquipmentDomain.add(entryEquipmentMock)

    updateProcessMock = {
      status: 'analise',
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

    bodyData = {
      id: entry.processId,
      updateProcessMock,
    }
  })

  test('update', async () => {
    const response = await request().put('/api/process/update', bodyData, { headers })

    const { body, statusCode } = response
    expect(statusCode).toBe(200)
    expect(body.status).toBe(updateProcessMock.status)
  })

  test('getall', async () => {
    const response = await request().get('/api/process', { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.count).toBeTruthy()
    expect(body.page).toBeTruthy()
    expect(body.show).toBeTruthy()
    expect(body.rows).toBeTruthy()
  })
})
