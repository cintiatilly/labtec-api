// const R = require('ramda')

const EquipTypeDomain = require('../../domains/equip/equipType')
const PartDomain = require('../../domains/part')
const AnalyzeDomain = require('./')

// const { FieldValidationError } = require('../../helpers/errors')

const partDomain = new PartDomain()
const equipTypeDomain = new EquipTypeDomain()
const analyzeDomain = new AnalyzeDomain()


describe('analyzeDomain', () => {
  let analyzeMock = null
  let analysisPartMock = null

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
      equipModels: [modelMock.id],
    }

    const partCreated = await partDomain.add(partMock)

    analysisPartMock = {
      partId: partCreated.id,
      description: 'garrafa furada.',
    }

    analyzeMock = {
    //   humidity,
    //   fall,
    //   misuse,
    //   brokenSeal,
    //   factory,
      analysisPart: [analysisPartMock, analysisPartMock],
    }
  })

  test('create', async () => {
    const analyzeCreated = await analyzeDomain.add(analyzeMock)
    const analyzeCreated1 = await analyzeDomain.add(analyzeMock)


    expect(analyzeCreated).toBeTruthy()
    expect(analyzeCreated1).toBeTruthy()
  })

  // test('analyzeUpdateById', async () => {
  //   const analyzeCreated = await analyzeDomain.add(analyzeMock)
  //   analyzeCreated.status = 'aprovado'
  //   const analyzeUpdate = {
  //     ...analyzeCreated,
  //   }

  //   await analyzeDomain.analyzeUpdateById(analyzeCreated.id, analyzeUpdate)
  // })
})
