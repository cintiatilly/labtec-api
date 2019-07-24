const request = require('../../../helpers/request')

const EquipTypeDomain = require('../../../domains/equip/equipType')
const PartDomain = require('../../../domains/part')
const AnalyzeDomain = require('../../../domains/analyze')
const AnalysisPartDomain = require('../../../domains/analyze/analysisPart')

// const { FieldValidationError } = require('../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analyzeDomain = new AnalyzeDomain()
const analysisPartDomain = new AnalysisPartDomain()

describe('analysisPartController', () => {
  let analyzeMock = null
  let analysisPartMock = null
  let analysisPartUpdateMock = null
  let bodyData = null
  let equipMarkMock = null
  let equipModelMock = null
  let headers = null
  let partMock = null

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

    analyzeMock = {
      // garantia: 'externa',
      // conditionType: 'avulso',
      humidity: false,
      fall: false,
      misuse: false,
      brokenSeal: false,
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
