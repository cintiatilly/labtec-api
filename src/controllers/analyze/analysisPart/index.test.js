const request = require('../../../helpers/request')

const EquipTypeDomain = require('../../../domains/equip/equipType')
const PartDomain = require('../../../domains/part')
const AnalyzeDomain = require('../../../domains/analyze')
const AnalysisPartDomain = require('../../../domains/analyze/analysisPart')
const CompanyDomain = require('../../../domains/company')
const EquipDomain = require('../../../domains/equip')
const EntryEquipmentDomain = require('../../../domains/entryEquipment')

// const { FieldValidationError } = require('../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analyzeDomain = new AnalyzeDomain()
const analysisPartDomain = new AnalysisPartDomain()
const companyDomain = new CompanyDomain()
const equipDomain = new EquipDomain()
const entryEquipmentDomain = new EntryEquipmentDomain()

describe('analysisPartController', () => {
  let analyzeMock = null
  let analysisPartMock = null
  let analysisPartUpdateMock = null
  let bodyData = null
  let equipMarkMock = null
  let equipModelMock = null
  let headers = null
  let partMock = null
  let companyMock = null
  let equipMock = null
  let entryEquipmentCreated = null

  beforeAll(async () => {
    equipMarkMock = {
      type: 'catraca',
      mark: 'DC',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    equipModelMock = {
      equipMarkId: markMock.id,
      model: 'DC 2.0',
      description: '',
    }

    const modelMock = await equipTypeDomain.addModel(equipModelMock)

    partMock = {
      item: 'celular',
      description: '',
      costPrice: '100,00',
      salePrice: '150,00',
      equipModels: [{ id: modelMock.id }],
    }

    const partCreated = await partDomain.add(partMock)

    companyMock = {
      razaoSocial: 'testes analysisPartController LTDA',
      cnpj: '70159807000157',
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
      serialNumber: '12541254',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    const entryEquipmentMock = {
      humidity: false,
      fall: false,
      misuse: false,
      brokenSeal: false,
      serialNumber: '12541254',
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
      analysisPart: [],
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

    analysisPartUpdateMock = {
      discount: '12,5%',
      effectivePrice: '100.00',
      approved: true,
    }

    const analysisPartCreated = await analysisPartDomain.add(analysisPartMock)

    bodyData = {
      id: analysisPartCreated.id,
      analysisPartUpdateMock,
    }
  })

  test('create', async () => {
    const response = await request().post('/api/analyze/analysisPart', analysisPartMock, { headers })

    const { statusCode } = response

    expect(statusCode).toBe(200)
    expect(response).toBeTruthy()
  })

  test('analysisPartUpdate', async () => {
    const response = await request().put('/api/analyze/analysisPartUpdate', bodyData, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.description).toBe(analysisPartMock.description)
    expect(body.effectivePrice).toBe('10000')
    expect(body.approved).toBe(analysisPartUpdateMock.approved)
  })
})
