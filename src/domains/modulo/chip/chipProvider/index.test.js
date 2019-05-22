const { FieldValidationError } = require('../../../../helpers/errors')
const ChipProviderDomain = require('./')

const chipProviderDomain = new ChipProviderDomain()

describe('chipProvider-domain', () => {
  describe('chipProviderCreateTest', () => {
    test('try add chipProvider with correct date and add another with the same date', async () => {
      const providerMock = {
        mobileProvider: 'Vivo',
      }

      const chipProviderCreated = await chipProviderDomain.chipProvider_Create(providerMock)

      expect(chipProviderCreated.mobileProvider).toEqual(providerMock.mobileProvider)

      await expect(chipProviderDomain.chipProvider_Create(providerMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'mobileProvider',
          message: 'mobileProvider already exist',
        }]))
    })

    test('mobileProvider null', async () => {
      const providerMock = {
        mobileProvider: '',
      }

      await expect(chipProviderDomain.chipProvider_Create(providerMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'mobileProvider',
          message: 'mobileProvider cannot be null',
        }]))
    })

    test('mobileProvider does not exist', async () => {
      const providerMock = {
        id: '13213131',
      }

      await expect(chipProviderDomain.chipProvider_Create(providerMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'mobileProvider',
          message: 'mobileProvider does not exist',
        }]))
    })
  })


  describe('get chipProvider by id', async () => {
    test('get id null', async () => {
      const providerMock = {
        id: '',
      }

      await expect(chipProviderDomain.chipProvider_Create(providerMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id cannot be null',
        }]))
    })

    test('id invalid', async () => {
      await expect(chipProviderDomain.chipProvider_Create('uau')).rejects
        .toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id is invalid',
        }]))
    })
  })


  describe('update chipProvider by id', async () => {
    test('no has mobileProvider', async () => {
      const providerMock = {
        id: '13213131',
      }

      await expect(chipProviderDomain.chipProvider_Create(providerMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'mobileProvider',
          message: 'mobileProvider does not exist',
        }]))
    })

    test('mobileProvider null', async () => {
      const providerMock = {
        mobileProvider: '',
      }

      await expect(chipProviderDomain.chipProvider_Create(providerMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'mobileProvider',
          message: 'mobileProvider cannot be null',
        }]))
    })

    test('mobileProvider already exist', async () => {
      const providerMock = {
        mobileProvider: 'Claro',
      }
      const chipProviderCreated = await chipProviderDomain.chipProvider_Create(providerMock)

      expect(chipProviderCreated.mobileProvider).toEqual(providerMock.mobileProvider)

      await expect(chipProviderDomain.chipProvider_Create(providerMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'mobileProvider',
          message: 'mobileProvider already exist',
        }]))
    })
  })
})
