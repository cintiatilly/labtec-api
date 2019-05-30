const R = require('ramda')

const EquipTypeDomain = require('./index')

const { FieldValidationError } = require('../../../helpers/errors')

const equipTypeDomain = new EquipTypeDomain()

describe('equipType', () => {
  let equipTypeMock = null

  beforeAll(() => {
    equipTypeMock = {
      type: 'catraca',
      mark: 'Festo',
      model: 'Não conheço nenhum',
      description: 'sadddas',
    }
  })

  test('create', async () => {
    const equipTypeCreated = await equipTypeDomain.add(equipTypeMock)

    console.log(JSON.stringify(equipTypeCreated))

    expect(equipTypeCreated.type).toBe(equipTypeMock.type)
    expect(equipTypeCreated.markId).toBe(equipTypeMock.markId)
    // expect(equipTypeCreated.model).toBe(equipTypeMock.model)
    // expect(equipTypeCreated.description).toBe(equipTypeMock.description)

    // await expect(equipTypeDomain.add(equipTypeMock))
    //   .rejects.toThrowError(new FieldValidationError())
  })

  test('try add equipType with description null', async () => {
    equipTypeMock.model = 'Ford'
    equipTypeMock.description = ''
    const equipTypeCreated = await equipTypeDomain.add(equipTypeMock)

    expect(equipTypeCreated).toBeTruthy()
  })

  test('try add equipType with Type null', async () => {
    equipTypeMock.type = ''

    await expect(equipTypeDomain.add(equipTypeMock)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'Type',
        message: 'type is required',
      }]))
  })


  test('try add equipType without Type', async () => {
    const equipTypeMockCreated = R.omit(['Type'], equipTypeMock)

    await expect(equipTypeDomain.add(equipTypeMockCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'Type',
        message: 'type is required',
      }]))
  })

  test('try add equipType with mark null', async () => {
    equipTypeMock.mark = ''

    await expect(equipTypeDomain.add(equipTypeMock)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'mark',
        message: 'mark is required',
      }]))
  })


  test('try add equipType without mark', async () => {
    const equipTypeMockCreated = R.omit(['mark'], equipTypeMock)

    await expect(equipTypeDomain.add(equipTypeMockCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'mark',
        message: 'mark is required',
      }]))
  })

  test('try add equipType with model null', async () => {
    equipTypeMock.model = ''

    await expect(equipTypeDomain.add(equipTypeMock)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'model',
        message: 'model is required',
      }]))
  })


  test('try add equipType without model', async () => {
    const equipTypeMockCreated = R.omit(['model'], equipTypeMock)

    await expect(equipTypeDomain.add(equipTypeMockCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'model',
        message: 'model is required',
      }]))
  })

  test('try add equipType without description', async () => {
    const equipTypeMockCreated = R.omit(['description'], equipTypeMock)

    await expect(equipTypeDomain.add(equipTypeMockCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'description',
        message: 'property description is required',
      }]))
  })

  // test('create equipType with same make and model, but different type', async () => {
  //   const equipTypeMock1 = {
  //     type: 'catraca',
  //     mark: 'GM',
  //     model: 'Onix',
  //     description: '',
  //   }
  //   const equipTypeMock2 = {
  //     type: 'relogio',
  //     mark: 'GM',
  //     model: 'Onix',
  //     description: '',
  //   }

  //   await equipTypeDomain.add(equipTypeMock1)

  //   const equipTypeCreated = await equipTypeDomain.add(equipTypeMock2)

  //   expect(equipTypeCreated.type).toBe(equipTypeMock2.type)
  //   expect(equipTypeCreated.mark).toBe(equipTypeMock2.mark)
  //   expect(equipTypeCreated.model).toBe(equipTypeMock2.model)
  //   expect(equipTypeCreated.description).toBe(equipTypeMock2.description)
  // })

  // test('create quipType of the piece type with the same model and brand', async () => {
  //   const equipTypeMock1 = {
  //     type: 'peca',
  //     mark: 'Ford',
  //     model: 'Ka',
  //     description: 'Motor',
  //   }
  //   const equipTypeMock2 = {
  //     type: 'peca',
  //     mark: 'Ford',
  //     model: 'Ka',
  //     description: 'Volante',
  //   }

  //   const equipTypeCreated1 = await equipTypeDomain.add(equipTypeMock1)

  //   const equipTypeCreated2 = await equipTypeDomain.add(equipTypeMock2)

  //   expect(equipTypeCreated1).toBeTruthy()
  //   expect(equipTypeCreated2).toBeTruthy()

  //   await expect(equipTypeDomain.add(equipTypeMock2)).rejects
  //     .toThrowError(new FieldValidationError([{
  //       field: 'description',
  //       message: 'peca alread exist',
  //     }]))
  // })

  // test('getAll', async () => {
  //   const equipTypes = await equipTypeDomain.getAll()
  //   expect(equipTypes.rows.length > 0).toBeTruthy()
  // })
})
