const R = require('ramda')
const { isUUID } = require('validator')

const { FieldValidationError } = require('../../../helpers/errors')
const database = require('../../../database')

const Chip = database.model('chip')


class ChipDomain {
  // eslint-disable-next-line camelcase
  async chip_Create(bodyData, options = {}) {
    const { transaction = null } = options
    const chip = R.omit(['id', 'status'], bodyData)

    const noHasNumChip = R.not(R.has('numChip', chip))

    const noHasLot = R.not(R.has('lot', chip))

    const HasIp = R.has('ip', chip)

    if (noHasLot || !chip.lot) {
      throw new FieldValidationError([{
        field: 'lot',
        message: 'lot cannot be null',
      }])
    }

    if (noHasNumChip || !chip.numChip) {
      throw new FieldValidationError([{
        field: 'numChip',
        message: 'numChip cannot be null',
      }])
    }

    if (HasIp) {
      if (chip.ip) {
        const chipIpExistent = await Chip.findOne({
          where: { ip: chip.ip },
        })
        if (chipIpExistent) {
          throw new FieldValidationError([{
            field: 'ip',
            message: 'ip already exists',
          }])
        }
      }
    }

    const numChip = await Chip.findOne({
      where: {
        numChip: chip.numChip,
      },
      transaction,
    })

    if (numChip) {
      throw new FieldValidationError([{
        field: 'numChip',
        message: 'numChip already exist',
      }])
    }

    const optionsForCreate = {
      transaction,
    }

    const chipCreated = await Chip.create(chip, optionsForCreate)

    const chipReturned = await Chip.findByPk(
      chipCreated.id, {
        transaction,
      },
    )

    return chipReturned
  }

  // eslint-disable-next-line camelcase
  async chip_GetById(id, options = {}) {
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

    const chipReturned = await Chip.findByPk(id, {
      transaction,
    })
    return chipReturned
  }

  // eslint-disable-next-line camelcase
  async chip_updateById(id, bodyData, options = {}) {
    const { transaction = null } = options
    const chip = R.omit(['id'], bodyData)

    const chipHasNumChip = R.has('numChip', chip)

    const chipHasLot = R.has('lot', chip)

    const chipHasStatus = R.has('status', chip)

    const chipHasIp = R.has('ip', chip)

    const HasIp = R.has('ip', chip)

    let newChip = {}

    if (chipHasNumChip) {
      newChip = {
        ...newChip,
        numChip: R.prop('numChip', chip),
      }

      const numChip = await Chip.findOne({
        where: {
          numChip: chip.numChip,
        },
        transaction,
      })

      if (numChip) {
        throw new FieldValidationError([{
          field: 'numChip',
          message: 'numChip already exist',
        }])
      }
    }

    if (chipHasStatus) {
      newChip = {
        ...newChip,
        status: R.prop('status', chip),
      }
    }

    if (HasIp) {
      if (!chip.ip) {
        const chipIpExistent = await Chip.findOne({
          where: { ip: chip.ip },
        })

        if (chipIpExistent) {
          throw new FieldValidationError([{
            field: 'ip',
            message: 'ip already exists',
          }])
        }
      }
    }

    if (chipHasLot) {
      newChip = {
        ...newChip,
        lot: R.prop('lot', chip),
      }
    }

    if (chipHasIp) {
      newChip = {
        ...newChip,
        ip: R.prop('ip', chip),
      }
    }

    const chipInstance = await this.chip_GetById(id, { transaction })

    await chipInstance.update(newChip)

    const chipUpdated = await this.chip_GetById(id, { transaction })

    return chipUpdated
  }
}

module.exports = ChipDomain
