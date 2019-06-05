const R = require('ramda')

const CompanyDomain = require('../company')
const EntryEquipmentDomain = require('./')
const EquipTypeDomain = require('../equip/equipType')
const EquipDomain = require('../equip')


const { FieldValidationError } = require('../../helpers/errors')

const companyDomain = new CompanyDomain()
const entryEquipmentDomain = new EntryEquipmentDomain()
const equipTypeDomain = new EquipTypeDomain()
const equipDomain = new EquipDomain()


describe('entryEquipmentDomain', () => {
  let companyMock = null
  let entryEquipmentMock = null
  let equipMock = null
  let equipMarkMock = null

  beforeAll(async () => {
    companyMock = {
      razaoSocial: 'testes 6954321 LTDA',
      cnpj: '04550884000109',
      street: 'jadaisom rodrigues',
      number: '69',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '03299-080',
      telphone: '(11)8565-4658',
      nameContact: 'jose',
      email: 'jose@gmail.com',
    }

    const companyCreated = await companyDomain.add(companyMock)

    equipMarkMock = {
      type: 'catraca',
      mark: 'Festo',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    const equipTypeMock = {
      equipMarkId: markMock.id,
      model: 'Henry 7.0',
      description: '',
    }


    const equipModelCreated = await equipTypeDomain.addModel(equipTypeMock)

    equipMock = {
      equipModelId: equipModelCreated.id,
      companyId: companyCreated.id,
      serialNumber: '696969',
      readerColor: 'Verde',
      details: '',
    }

    await equipDomain.add(equipMock)

    entryEquipmentMock = {
      serialNumber: '696969',
      externalDamage: true,
      details: 'tá zuado',
      defect: 'fonte',
      delivery: 'Técnico externo',
      technicianName: 'Carlos',
      motoboyName: 'vanderlei',
      responsibleName: 'cleiton',
      clientName: 'Adalto',
      RG: '95.546.654-2',
      Cpf: '93892472092',
      senderName: 'Amorim',
      properlyPacked: true,
      zipCode: '12345-678',
      state: 'Sao Paulo',
      city: 'SBC',
      neighborhood: 'Pauliceia',
      street: 'Rua dos bobo',
      number: '0',
    }
  })

  test('create', async () => {
    const entryEquipmentCreated = await entryEquipmentDomain.add(entryEquipmentMock)

    expect(entryEquipmentCreated.externalDamage).toBe(entryEquipmentMock.externalDamage)
    expect(entryEquipmentCreated.details).toBe(entryEquipmentMock.details)
    expect(entryEquipmentCreated.defect).toBe(entryEquipmentMock.defect)
    expect(entryEquipmentCreated.delivery).toBe(entryEquipmentMock.delivery)
    expect(entryEquipmentCreated.clientName).toBe(entryEquipmentMock.clientName)
    expect(entryEquipmentCreated.RG).toBe(entryEquipmentMock.RG)
    expect(entryEquipmentCreated.Cpf).toBe(entryEquipmentMock.Cpf)
    expect(entryEquipmentCreated.equip.serialNumber).toBe(entryEquipmentMock.serialNumber)
  })

  test('try add entryEquipment with externalDamage false and details null', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.externalDamage = false
    entryEquipmentCreated.details = ''

    const entryEquipment = await entryEquipmentDomain.add(entryEquipmentCreated)
    expect(entryEquipment).toBeTruthy()
  })

  test('try add entryEquipment with serialNumber null', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.serialNumber = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'serialNumber',
        message: 'serialNumber cannot be null',
      }]))
  })


  test('try add entryEquipment without serialNumber', async () => {
    const entryEquipmentCreated = R.omit(['serialNumber'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'serialNumber',
        message: 'serialNumber cannot be null',
      }]))
  })

  test('try add entryEquipment with externalDamage null', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.externalDamage = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'externalDamage',
        message: 'externalDamage cannot be null',
      }]))
  })


  test('try add entryEquipment without externalDamage', async () => {
    const entryEquipmentCreated = R.omit(['externalDamage'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'externalDamage',
        message: 'externalDamage cannot be null',
      }]))
  })


  test('try add entryEquipment with details null', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.details = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'details',
        message: 'details cannot be null',
      }]))
  })


  test('try add entryEquipment without details', async () => {
    const entryEquipmentCreated = R.omit(['details'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'details',
        message: 'details cannot be null',
      }]))
  })

  test('try add entryEquipment with defect null', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.defect = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'defect',
        message: 'defect cannot be null',
      }]))
  })


  test('try add entryEquipment without defect', async () => {
    const entryEquipmentCreated = R.omit(['defect'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'defect',
        message: 'defect cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery null', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })


  test('try add entryEquipment without delivery', async () => {
    const entryEquipmentCreated = R.omit(['delivery'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery invalid', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Clientesss'

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery invalid',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and clientName null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Cliente'
    entryEquipmentCreated.clientName = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'clientName',
        message: 'clientName cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and without clientName', async () => {
    entryEquipmentMock.delivery = 'Cliente'

    const entryEquipmentCreated = R.omit(['clientName'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and RG null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Cliente'
    entryEquipmentCreated.RG = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'RG',
        message: 'RG cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and without RG', async () => {
    entryEquipmentMock.delivery = 'Cliente'

    const entryEquipmentCreated = R.omit(['RG'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and Cpf null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Cliente'
    entryEquipmentCreated.Cpf = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'Cpf',
        message: 'Cpf cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and without Cpf', async () => {
    entryEquipmentMock.delivery = 'Cliente'

    const entryEquipmentCreated = R.omit(['Cpf'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Sedex and senderName null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Sedex'
    entryEquipmentCreated.senderName = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery invalid',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and without senderName', async () => {
    entryEquipmentMock.delivery = 'Sedex'

    const entryEquipmentCreated = R.omit(['senderName'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Sedex and properlyPacked null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Sedex'
    entryEquipmentCreated.properlyPacked = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery invalid',
      }]))
  })

  test('try add entryEquipment with delivery Cliente and without properlyPacked', async () => {
    entryEquipmentMock.delivery = 'Sedex'

    const entryEquipmentCreated = R.omit(['properlyPacked'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Sedex and zipCode null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Sedex'
    entryEquipmentCreated.zipCode = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery invalid',
      }]))
  })

  test('try add entryEquipment with delivery Sedex and without zipCode', async () => {
    entryEquipmentMock.delivery = 'Sedex'

    const entryEquipmentCreated = R.omit(['zipCode'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Motoboy and RG null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Motoboy'
    entryEquipmentCreated.RG = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'RG',
        message: 'RG cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Motoboy and without RG', async () => {
    entryEquipmentMock.delivery = 'Motoboy'

    const entryEquipmentCreated = R.omit(['RG'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Motoboy and Cpf null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Motoboy'
    entryEquipmentCreated.Cpf = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'Cpf',
        message: 'Cpf cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Motoboy and without Cpf', async () => {
    entryEquipmentMock.delivery = 'Motoboy'

    const entryEquipmentCreated = R.omit(['Cpf'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Sedex and senderName null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Sedex'
    entryEquipmentCreated.senderName = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery invalid',
      }]))
  })

  test('try add entryEquipment with delivery Motoboy and without senderName', async () => {
    entryEquipmentMock.delivery = 'Sedex'

    const entryEquipmentCreated = R.omit(['senderName'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })

  test('try add entryEquipment with delivery Motoboy and properlyPacked null ', async () => {
    const entryEquipmentCreated = entryEquipmentMock
    entryEquipmentCreated.delivery = 'Sedex'
    entryEquipmentCreated.properlyPacked = ''

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery invalid',
      }]))
  })

  test('try add entryEquipment with delivery Motoboy and without properlyPacked', async () => {
    entryEquipmentMock.delivery = 'Sedex'

    const entryEquipmentCreated = R.omit(['properlyPacked'], entryEquipmentMock)

    await expect(entryEquipmentDomain.add(entryEquipmentCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'delivery',
        message: 'delivery cannot be null',
      }]))
  })
})
