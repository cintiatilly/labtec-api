const request = require('../../helpers/request')

const CompanyDomain = require('../../domains/company')
const EquipTypeDomain = require('../../domains/equip/equipType')
const EquipDomain = require('../../domains/equip')

const companyDomain = new CompanyDomain()
const equipTypeDomain = new EquipTypeDomain()
const equipDomain = new EquipDomain()

describe('entryEquipmentDomain', () => {
  let companyMock = null
  let entryEquipmentMock = null
  let equipMock = null
  let headers = null

  beforeAll(async () => {
    companyMock = {
      razaoSocial: 'testes 691 LTDA',
      cnpj: '50418420000160',
      street: 'jadaisom rodrigues',
      number: '69',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '03299-080',
      telphone: '(11)8565-1058',
      nameContact: 'josel',
      email: 'josel@gmail.com',
    }

    const companyCreated = await companyDomain.add(companyMock)

    const equipTypeMock = {
      type: 'catraca',
      mark: 'Henry',
      model: 'Henry 11.0',
      description: '',
    }

    const equipModelCreated = await equipTypeDomain.add(equipTypeMock)

    equipMock = {
      equipModelId: equipModelCreated.id,
      companyId: companyCreated.id,
      serialNumber: '696970',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    entryEquipmentMock = {
      serialNumber: '696970',
      externalDamage: true,
      details: 'tá zuado',
      defect: 'fonte',
      delivery: 'Técnico externo',
      technicianName: 'Carlos',
      motoboyName: 'vanderlei',
      responsibleName: 'cleiton',
      clientName: 'Adalto',
      RG: '95.546.654-2',
      Cpf: '93892472092',
      senderName: 'Amorim',
      properlyPacked: true,
      zipCode: '12345-678',
      state: 'Sao Paulo',
      city: 'SBC',
      neighborhood: 'Pauliceia',
      street: 'Rua dos bobo',
      number: '0',
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
    const response = await request().post('/api/entryEquipment', entryEquipmentMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.equip.serialNumber).toBe(entryEquipmentMock.serialNumber)
    expect(body.externalDamage).toBe(entryEquipmentMock.externalDamage)
    expect(body.details).toBe(entryEquipmentMock.details)
    expect(body.defect).toBe(entryEquipmentMock.defect)
    expect(body.delivery).toBe(entryEquipmentMock.delivery)
  })
})
