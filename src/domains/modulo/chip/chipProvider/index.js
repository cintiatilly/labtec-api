const R = require('ramda')
const { isUUID } = require('validator')

const { FieldValidationError } = require('../../../../helpers/errors')

const database = require('../../../../database')

const ChipProvider = database.model('chipProvider')

class ChipProviderDomain {
  // eslint-disable-next-line camelcase
  async chipProvider_Create(bodyData, options = {}) {
    const { transaction = null } = options

    const chipProvider = R.omit(['id'], bodyData)

    const noHasMobileProvider = R.not(R.has('mobileProvider', chipProvider))

    if (noHasMobileProvider) {
      throw new FieldValidationError([{
        field: 'mobileProvider',
        message: 'mobileProvider does not exist',
      }])
    }

    if (!chipProvider.mobileProvider) {
      throw new FieldValidationError([{
        field: 'mobileProvider',
        message: 'mobileProvider cannot be null',
      }])
    }

    const provider = await ChipProvider.findOne({
      where: {
        mobileProvider: chipProvider.mobileProvider,
      },
      transaction,
    })

    if (provider) {
      throw new FieldValidationError([{
        field: 'mobileProvider',
        message: 'mobileProvider already exist',
      }])
    }

    const chipProviderCreated = await ChipProvider.create(chipProvider, {
      transaction,
    })

    const chipProviderReturned = await ChipProvider.findByPk(
      chipProviderCreated.id, {
        transaction,
      },
    )

    return chipProviderReturned
  }

  // eslint-disable-next-line camelcase
  async chipProvider_GetById(id, options = {}) {
    const { transaction = null } = options

    if (!id) {
      throw new FieldValidationError([{
        name: 'id',
        message: 'id cannot to be null',
      }])
    }

    if (!isUUID(id)) {
      throw new FieldValidationError([{
        name: 'id',
        message: 'id is invalid',
      }])
    }

    const chipProviderReturned = await ChipProvider.findByPk(id, {
      transaction,
    })
    return chipProviderReturned
  }

  // eslint-disable-next-line camelcase
  async chipProvider_UpdateById(id, bodyData, options = {}) {
    const { transaction = null } = options

    const chipProvider = R.omit(['id'], bodyData)

    const noHasMobileProvider = R.not(R.has('mobileProvider', chipProvider))

    if (noHasMobileProvider) {
      throw new FieldValidationError([{
        field: 'mobileProvider',
        message: 'mobileProvider cannot be null',
      }])
    }

    const newChipProvider = {
      mobileProvider: R.prop('mobileProvider', chipProvider),
    }

    const provider = await ChipProvider.findOne({
      where: {
        mobileProvider: newChipProvider.mobileProvider,
      },
      transaction,
    })

    if (provider) {
      throw new FieldValidationError([{
        field: 'mobileProvider',
        message: 'mobileProvider already exist',
      }])
    }

    const chipProviderInstance = await this.getById(id, {
      transaction,
    })

    await chipProviderInstance.update(newChipProvider)

    const chipProviderUpdated = await this.getById(id, {
      transaction,
    })

    return chipProviderUpdated
  }
}

module.exports = ChipProviderDomain
