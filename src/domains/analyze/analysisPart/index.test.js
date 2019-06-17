// const R = require('ramda')

const EquipTypeDomain = require('../../equip/equipType')
const PartDomain = require('../../part')
const AnalysisPartDomain = require('./')
const AnalyzeDomain = require('../')

// const { FieldValidationError } = require('../../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analysisPartDomain = new AnalysisPartDomain()
const analyzeDomain = new AnalyzeDomain()


describe('analysisPartDomain', () => {
  let partMock = null
  let equipModelMock = null
  let equipMarkMock = null
  let analysisPartMock = null
  let analyzeMock = null

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
      equipModels: [modelMock.id],
    }

    const partCreated = await partDomain.add(partMock)

    analyzeMock = {
      garantia: 'externa',
      conditionType: 'avulso',
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
