const R = require('ramda')

const EquipDomain = require('./index')
const CompanyDomain = require('../company/index')
const EquipTypeDomain = require('./equipType/index')


const { FieldValidationError } = require('../../helpers/errors')

const equipDomain = new EquipDomain()
const companyDomain = new CompanyDomain()
const equipTypeDomain = new EquipTypeDomain()


describe('equipDomain', () => {
  let equipMock = null

  beforeAll(async () => {
    const companyMock = {
      razaoSocial: 'teste 12345 LTDA',
      cnpj: '12533380000109',
      street: 'jaime rodrigues',
      number: '69',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '03465-080',
      telphone: '(11)0995-4568',
      nameContact: 'jaimeldom',
      email: 'jaime@gmasi.com',
    }

    const companyCreated = await companyDomain.add(companyMock)

    const equipTypeMock = {
      type: 'catraca',
      mark: 'Hanry',
      model: 'Henry 2.0',
      description: '',
    }

    const equipModelCreated = await equipTypeDomain.add(equipTypeMock)

    equipMock = {
      equipModelId: equipModelCreated.id,
      companyId: companyCreated.id,
      serialNumber: '12345687',
      readerColor: 'Verde',
      details: '',
    }
  })

  test('create', async () => {
    const equipCreated = await equipDomain.add(equipMock)

    expect(equipCreated.equipModelId).toBe(equipMock.equipModelId)
    expect(equipCreated.companyId).toBe(equipMock.companyId)
    expect(equipCreated.serialNumber).toBe(equipMock.serialNumber)
    expect(equipCreated.readerColor).toBe(equipMock.readerColor)
    expect(equipCreated.details).toBe(equipMock.details)

    await expect(equipDomain.add(equipMock))
      .rejects.toThrowError(new FieldValidationError())
  })

  test('try add equip with equipModelId null', async () => {
    const equipCreated = equipMock
    equipCreated.equipModelId = ''

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'equipModelId',
        message: 'equipModelId cannot be null',
      }]))
  })


  test('try add equip without equipModelId', async () => {
    const equipCreated = R.omit(['equipModelId'], equipMock)

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'equipModelId',
        message: 'equipModelId cannot be null',
      }]))
  })

  test('try add equip with companyId null', async () => {
    const equipCreated = equipMock
    equipCreated.companyId = ''

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'companyId',
        message: 'companyId cannot be null',
      }]))
  })


  test('try add equip without companyId', async () => {
    const equipCreated = R.omit(['companyId'], equipMock)

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'companyId',
        message: 'companyId cannot be null',
      }]))
  })


  test('try add equip with serialNumber null', async () => {
    const equipCreated = equipMock
    equipCreated.serialNumber = ''

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'serialNumber',
        message: 'serialNumber cannot be null',
      }]))
  })


  test('try add equip without serialNumber', async () => {
    const equipCreated = R.omit(['serialNumber'], equipMock)

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'serialNumber',
        message: 'serialNumber cannot be null',
      }]))
  })


  test('try add equip without equipModelId invalid', async () => {
    const equipCreated = {
      ...equipMock,
      equipModelId: '2360dcfe-4288-4916-b526-078d7da53ec1',
    }

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'equipModelId',
        message: 'equipModelId invalid',
      }]))
  })

  test('try add equip without companyId invalid', async () => {
    const equipCreated = {
      ...equipMock,
      companyId: '2360dcfe-4288-4916-b526-078d7da53ec1',
    }

    await expect(equipDomain.add(equipCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'companyId',
        message: 'companyId invalid',
      }]))
  })

  test('getAll', async () => {
    const equips = await equipDomain.getAll()
    expect(equips.rows.length > 0).toBeTruthy()
  })
})
