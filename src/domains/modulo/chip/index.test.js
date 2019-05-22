const R = require('ramda')

const { FieldValidationError } = require('../../../helpers/errors')
const { generateChip } = require('../../../helpers/mockData/chip')
const ChipDomain = require('./')

const ChipProvider = require('./chipProvider')

const chipProvider = new ChipProvider()

const chipDomain = new ChipDomain()

describe('chip-domain', () => {
  let provider = null

  beforeAll(async () => {
    provider = await chipProvider.chipProvider_Create({
      mobileProvider: 'Teste Chip Domain',
    })
  })

  describe('chipCreateTest', () => {
    let chipMockGenerated = {}
    let counter = 200

    beforeEach(() => {
      chipMockGenerated = generateChip(counter.toString(), provider.id)
      counter += 1
    })

    test('try add chip with correct date', async () => {
      const chipMock = chipMockGenerated

      const chipCreated = await chipDomain.chip_Create(chipMock)

      expect(chipCreated.lot).toEqual(chipMock.lot)
      expect(chipCreated.numChip).toEqual(chipMock.numChip)
      expect(chipCreated.ip).toEqual(chipMock.ip)
      expect(chipCreated.status).toEqual('stock')
    })

    test('try add chip with ip existent', async () => {
      const chipMock = chipMockGenerated

      const chipCreated = await chipDomain.chip_Create(chipMock)

      await expect(chipCreated.ip).toEqual(chipMock.ip)

      await expect(chipDomain.chip_Create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'ip',
          message: 'ip already exist',
        }]))
    })

    test('try add chip with numChip null', async () => {
      const chipMock = chipMockGenerated
      chipMock.numChip = ''

      await expect(chipDomain.chip_Create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'numChip',
          message: 'numChip cannot be null',
        }]))
    })

    test('try add chip without numChip', async () => {
      const chipMock = R.omit(['numChip'], chipMockGenerated)

      await expect(chipDomain.chip_Create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'numChip',
          message: 'numChip cannot be null',
        }]))
    })

    test('try add chip omiting numChip', async () => {
      const chipMock = R.omit(['numChip'], chipMockGenerated)

      await expect(chipDomain.chip_Create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'numChip',
          message: 'numChip cannot be null',
        }]))
    })

    test('try add chip with lot null', async () => {
      const chipMock = chipMockGenerated
      chipMock.lot = ''

      await expect(chipDomain.chip_Create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'lot',
          message: 'lot cannot be null',
        }]))
    })

    test('try add chip omiting lot', async () => {
      const chipMock = R.omit(['lot'], chipMockGenerated)

      await expect(chipDomain.chip_Create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'lot',
          message: 'lot cannot be null',
        }]))
    })
  })

  describe('getChipByIdTest', () => {
    let chipMockGenerated = null
    let counter = 1
    beforeEach(async () => {
      const chipMock = generateChip(counter, provider.id)
      counter += 1
      chipMockGenerated = await chipDomain.chip_Create(chipMock)
    })

    test('get chip by id with correct date', async () => {
      const chipReturned = await chipDomain.chip_GetById(chipMockGenerated.id)

      expect(chipReturned.numChip).toEqual(chipMockGenerated.numChip)
      expect(chipReturned.ip).toEqual(chipMockGenerated.ip)
      expect(chipReturned.lot).toEqual(chipMockGenerated.lot)
      expect(chipReturned.status).toEqual('stock')
    })
    test('get chip by id equal null', async () => {
      await expect(chipDomain.chip_GetById(null))
        .rejects.toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id cannot be null',
        }]))
    })
    test('get incorrect id', async () => {
      await expect(chipDomain.chip_GetById('eda')).rejects
        .toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id is invalid',
        }]))
    })
  })

  describe('updateChipByIdTest', () => {
    let chipCreated = null
    let counter = 400
    beforeEach(async () => {
      const chipMock = generateChip(counter, provider.id)
      counter += 1
      chipCreated = await chipDomain.chip_Create(chipMock)
    })

    test('update chip by id with only numChip', async () => {
      const chipMock = R.omit(['lot', 'ip', 'id', 'status'], chipCreated)
      chipMock.numChip = '1234657891'

      const chipUpdate = await chipDomain.chip_updateById(chipCreated.id, chipMock)

      expect(chipUpdate.numChip).toEqual(chipMock.numChip)
      expect(chipUpdate.ip).toEqual(chipCreated.ip)
      expect(chipUpdate.lot).toEqual(chipCreated.lot)
      expect(chipUpdate.status).toEqual(chipCreated.status)
    })

    test('try update chip by id with ip existent', async () => {
      const chipMock = generateChip('499', provider.id)
      chipMock.ip = chipCreated.ip

      await expect(chipDomain.chip_Create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'ip',
          message: 'ip already exist',
        }]))
    })

    test('update chip by id with only lot', async () => {
      const chipMock = R.omit(['numChip', 'ip', 'id', 'status'], chipCreated)
      chipMock.lot = 'laercio'

      const chipUpdate = await chipDomain.chip_updateById(chipCreated.id, chipMock)

      expect(chipUpdate.numChip).toEqual(chipCreated.numChip)
      expect(chipUpdate.ip).toEqual(chipCreated.ip)
      expect(chipUpdate.lot).toEqual(chipMock.lot)
      expect(chipUpdate.status).toEqual(chipCreated.status)
    })

    test('update chip by id with only ip', async () => {
      const chipMock = R.omit(['numChip', 'numChip', 'id', 'status'], chipCreated)
      chipMock.ip = '1234657891'

      const chipUpdate = await chipDomain.chip_updateById(chipCreated.id, chipMock)

      expect(chipUpdate.numChip).toEqual(chipCreated.numChip)
      expect(chipUpdate.ip).toEqual(chipMock.ip)
      expect(chipUpdate.lot).toEqual(chipCreated.lot)
      expect(chipUpdate.status).toEqual(chipCreated.status)
    })
  })
})
