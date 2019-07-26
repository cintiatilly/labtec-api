// const R = require('ramda')

const EquipTypeDomain = require('../../equip/equipType')
const EntryEquipmentDomain = require('../../entryEquipment')
const PartDomain = require('../../part')
const AnalysisPartDomain = require('./')
const AnalyzeDomain = require('../')
const CompanyDomain = require('../../company')
const EquipDomain = require('../../equip')

// const { FieldValidationError } = require('../../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analysisPartDomain = new AnalysisPartDomain()
const analyzeDomain = new AnalyzeDomain()
const entryEquipmentDomain = new EntryEquipmentDomain()
const companyDomain = new CompanyDomain()
const equipDomain = new EquipDomain()

describe('analysisPartDomain', () => {
  let partMock = null
  let equipModelMock = null
  let equipMarkMock = null
  let analysisPartMock = null
  let analyzeMock = null
  let entryEquipmentCreated = null
  let companyMock = null
  let equipMock = null

  beforeAll(async () => {
    equipMarkMock = {
      type: 'catraca',
      mark: 'Dell',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    equipModelMock = {
      equipMarkId: markMock.id,
      model: 'Dell 2.0',
      description: '',
    }

    const modelMock = await equipTypeDomain.addModel(equipModelMock)

    partMock = {
      item: 'fonte',
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
      razaoSocial: 'testes analise de peça LTDA',
      cnpj: '44940950000171',
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
      serialNumber: '87458745',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    const entryEquipmentMock = {
      humidity: false,
      fall: false,
      misuse: false,
      brokenSeal: false,
      serialNumber: '87458745',
      externalDamage: true,
      details: 'tá zuado',
      defect: 'fonte',
      delivery: 'externo',
      technicianName: 'Carlos',
      garantia: 'externo',
      conditionType: 'avulso',
      properlyPacked: true,
      accessories: [],
    }

    entryEquipmentCreated = await entryEquipmentDomain.add(entryEquipmentMock)

    analyzeMock = {
      // garantia: 'externa',
      // conditionType: 'avulso',
      // humidity: false,
      // fall: false,
      // misuse: false,
      // brokenSeal: false,
      observations: '',
      init: new Date(),
      end: new Date(),
      processId: entryEquipmentCreated.processId,
    }

    const analyzeCreated = await analyzeDomain.add(analyzeMock)

    analysisPartMock = {
      analyzeId: analyzeCreated.id,
      partId: partCreated.id,
      description: 'fonte queimada.',
    }
  })


  test('create', async () => {
    const analysisPartCreated = await analysisPartDomain.add(analysisPartMock)
    const analysisPartCreated1 = await analysisPartDomain.add(analysisPartMock)

    expect(analysisPartCreated).toBeTruthy()
    expect(analysisPartCreated1).toBeTruthy()
  })


  test('analysisPartUpdate', async () => {
    const analysisPartUpdateMock = {
      discount: ' 12,5%',
      effectivePrice: '100.00',
      approved: true,
    }

    const analysisPartCreated = await analysisPartDomain.add(analysisPartMock)

    const analysisPartUpdate = await analysisPartDomain.analysisPartUpdate(analysisPartCreated.id,
      analysisPartUpdateMock)

    expect(analysisPartCreated).toBeTruthy()
    expect(analysisPartUpdate).toBeTruthy()
  })
})
