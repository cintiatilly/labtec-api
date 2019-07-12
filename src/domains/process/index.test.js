
// const database = require('../../database')
const ProcessDomain = require('../process')
const EntryEquipmentDomain = require('../entryEquipment')
const CompanyDomain = require('../company')
const EquipTypeDomain = require('../equip/equipType')
const EquipDomain = require('../equip')

const processDomain = new ProcessDomain()
const entryEquipmentDomain = new EntryEquipmentDomain()
const companyDomain = new CompanyDomain()
const equipTypeDomain = new EquipTypeDomain()
const equipDomain = new EquipDomain()

// const Process = database.model('process')

describe('ProcessDomain', () => {
  let entry = null
  let updateProcessMock = null
  let entryEquipmentMock = null
  let companyMock = null
  let equipMarkMock = null
  let equipMock = null

  beforeAll(async () => {
    entryEquipmentMock = {
      serialNumber: '2564',
      externalDamage: true,
      details: 'tá zuado',
      defect: 'fonte',
      delivery: 'externo',
      technicianName: 'Carlos',
      properlyPacked: true,
    }
    companyMock = {
      razaoSocial: 'Real teste 123/ .LTDA',
      cnpj: '72985831000170',
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
      mark: 'LG',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    const equipTypeMock = {
      equipMarkId: markMock.id,
      model: 'LG 7.0',
      description: '',
    }


    const equipModelCreated = await equipTypeDomain.addModel(equipTypeMock)

    equipMock = {
      equipModelId: equipModelCreated.id,
      companyId: companyCreated.id,
      serialNumber: '2564',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    entry = await entryEquipmentDomain.add(entryEquipmentMock)

    updateProcessMock = {
      status: 'analise',
    }
  })

  test('update', async () => {
    const updateProcess = await processDomain.update(entry.processId, updateProcessMock)

    expect(updateProcess).toBeTruthy()
  })

  test('getAll', async () => {
    const entrace = await processDomain.getAll()
    expect(entrace.rows.length > 0).toBeTruthy()
  })
})
