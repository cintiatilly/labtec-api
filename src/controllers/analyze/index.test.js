const request = require('../../helpers/request')

const EquipTypeDomain = require('../../domains/equip/equipType')
const PartDomain = require('../../domains/part')
const AnalyzeDomain = require('../../domains/analyze')

// const { FieldValidationError } = require('../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analyzeDomain = new AnalyzeDomain()

describe('analyzecontroller', () => {
  let analyzeMock = null
  let analysisPartMock = null
  let headers = null
  let bodyData = null
  let analyzeUpdateMock = null

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
      equipModels: [modelMock.id],
    }

    const partCreated = await partDomain.add(partMock)

    analysisPartMock = {
      partId: partCreated.id,
      description: 'garrafa furada.',
    }

    analyzeMock = {
      analysisPart: [analysisPartMock, analysisPartMock],
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

    analyzeUpdateMock = {
      status: 'aprovado',
    }

    const analyzeCreated = await analyzeDomain.add(analyzeMock)

    bodyData = {
      id: analyzeCreated.id,
      analyzeUpdateMock,
    }
  })

  test('create', async () => {
    const response = await request().post('/api/analyze', analyzeMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.humidity).toBe(false)
    expect(body.fall).toBe(false)
    expect(body.misuse).toBe(false)
    expect(body.brokenSeal).toBe(false)
    expect(body.factory).toBe(false)
  })

  test('analyzeUpdate', async () => {
    const response = await request().put('/api/analyze/Update', bodyData, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.status).toBe(analyzeUpdateMock.status)
  })
})
