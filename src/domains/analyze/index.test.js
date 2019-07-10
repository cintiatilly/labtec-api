// const R = require('ramda')

const database = require('../../database')
const EquipTypeDomain = require('../../domains/equip/equipType')
const PartDomain = require('../../domains/part')
const AnalyzeDomain = require('./')
const CompanyDomain = require('../company')
const EquipDomain = require('../equip')
const EntryEquipmentDomain = require('../entryEquipment')

// const { FieldValidationError } = require('../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analyzeDomain = new AnalyzeDomain()
const companyDomain = new CompanyDomain()
const equipDomain = new EquipDomain()
const entryEquipmentDomain = new EntryEquipmentDomain()

const Accessories = database.model('accessories')

describe('analyzeDomain', () => {
  let analyzeMock = null
  let analysisPartMock = null
  let companyMock = null
  let equipMock = null
  let accessoriesMock1 = null
  let accessoriesMock2 = null
  let entryEquipmentCreated = null

  beforeAll(async () => {
    const equipMarkMock = {
      type: 'catraca',
      mark: 'Lindóya',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    const equipModelMock = {
      equipMarkId: markMock.id,
      model: 'Lindóya 2.0',
      description: '',
    }

    const modelMock = await equipTypeDomain.addModel(equipModelMock)

    const partMock = {
      item: 'garrafa',
      description: '',
      costPrice: '100,00',
      salePrice: '150,00',
      equipModels: [{ id: modelMock.id }],
    }

    const partCreated = await partDomain.add(partMock)

    analysisPartMock = {
      partId: partCreated.id,
      description: 'garrafa furada.',
    }

    companyMock = {
      razaoSocial: 'testes 7070 LTDA',
      cnpj: '48864576000123',
      street: 'jadaisom rodrigues',
      number: '69',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '09930-210',
      telphone: '(11)8565-4118',
      nameContact: 'josi',
      email: 'josi@gmail.com',
    }

    const companyCreated = await companyDomain.add(companyMock)

    equipMock = {
      equipModelId: modelMock.id,
      companyId: companyCreated.id,
      serialNumber: '321654987',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    accessoriesMock1 = {
      accessories: 'fonte',
    }
    accessoriesMock2 = {
      accessories: 'teclado',
    }

    const accessory1 = await Accessories.create(accessoriesMock1)
    const accessory2 = await Accessories.create(accessoriesMock2)

    const entryEquipmentMock = {
      serialNumber: '321654987',
      externalDamage: true,
      details: 'tá zuado',
      defect: 'fonte',
      delivery: 'externo',
      technicianName: 'Carlos',
      properlyPacked: true,
      accessories: [accessory1, accessory2],
    }

    entryEquipmentCreated = await entryEquipmentDomain.add(entryEquipmentMock)

    analyzeMock = {
      garantia: 'externa',
      conditionType: 'avulso',
      analysisPart: [analysisPartMock, analysisPartMock],
      processId: entryEquipmentCreated.processId,
    }
  })

  test('create', async () => {
    const analyzeCreated = await analyzeDomain.add(analyzeMock)
    const analyzeCreated1 = await analyzeDomain.add(analyzeMock)

    expect(analyzeCreated).toBeTruthy()
    expect(analyzeCreated1).toBeTruthy()
    expect(analyzeCreated.garantia).toBe(analyzeMock.garantia)
    expect(analyzeCreated.conditionType).toBe(analyzeMock.conditionType)
    expect(analyzeCreated.processId).toBe(entryEquipmentCreated.processId)
  })


  test('analyzeUpdate', async () => {
    const analyzeUpdateMock = {
      status: 'aprovado',
    }

    const analyzeCreated = await analyzeDomain.add(analyzeMock)

    const analyzeUpdate = await analyzeDomain.analyzeUpdate(analyzeCreated.id,
      analyzeUpdateMock)

    expect(analyzeCreated).toBeTruthy()
    expect(analyzeUpdate).toBeTruthy()
  })
})
