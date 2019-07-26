const request = require('../../helpers/request')

const EquipTypeDomain = require('../../domains/equip/equipType')
const PartDomain = require('../../domains/part')
const AnalyzeDomain = require('../../domains/analyze')
const EntryEquipmentDomain = require('../../domains/entryEquipment')
const CompanyDomain = require('../../domains/company')
const EquipDomain = require('../../domains/equip')

// const { FieldValidationError } = require('../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analyzeDomain = new AnalyzeDomain()
const entryEquipmentDomain = new EntryEquipmentDomain()
const companyDomain = new CompanyDomain()
const equipDomain = new EquipDomain()

describe('analyzecontroller', () => {
  let analyzeMock = null
  let analysisPartMock = null
  let headers = null
  let bodyData = null
  let analyzeUpdateMock = null
  let entryEquipmentCreated = null
  let companyMock = null
  let equipMock = null

  beforeAll(async () => {
    const equipMarkMock = {
      type: 'catraca',
      mark: 'Zoo York',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    const equipModelMock = {
      equipMarkId: markMock.id,
      model: 'Zoo York 2.0',
      description: '',
    }

    const modelMock = await equipTypeDomain.addModel(equipModelMock)

    const partMock = {
      item: 'Boné',
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
      serialNumber: '98569856',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    const entryEquipmentMock = {
      humidity: false,
      fall: false,
      misuse: false,
      brokenSeal: false,
      serialNumber: '98569856',
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
      // analysisPart: [analysisPartMock, analysisPartMock],
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

    analyzeUpdateMock = {
      budgetStatus: 'aprovado',
    }

    const analyzeCreated = await analyzeDomain.add(analyzeMock)

    bodyData = {
      id: analyzeCreated.id,
      analyzeUpdateMock,
    }
  })

  test('create', async () => {
    const response = await request().post('/api/analyze', analyzeMock, { headers })

    const { statusCode } = response

    expect(statusCode).toBe(200)
    // expect(body.humidity).toBe(false)
    // expect(body.fall).toBe(false)
    // expect(body.misuse).toBe(false)
    // expect(body.brokenSeal).toBe(false)
  })

  test('analyzeUpdate', async () => {
    const response = await request().put('/api/analyze/Update', bodyData, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.budgetStatus).toBe(analyzeUpdateMock.budgetStatus)
  })
})
