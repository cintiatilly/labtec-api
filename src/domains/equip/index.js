const R = require('ramda')

const database = require('../../database')

const { FieldValidationError } = require('../../helpers/errors')

const EquipType = database.model('equipType')
const Company = database.model('company')
const Equip = database.model('equip')


module.exports = class EquipDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const equip = R.omit(['id'], bodyData)

    const equipNotHasProp = prop => R.not(R.has(prop, equip))

    const field = {
      equipTypeId: false,
      companyId: false,
      serialNumber: false,
      readerColor: false,
      details: false,
    }
    const message = {
      equipTypeId: '',
      companyId: '',
      serialNumber: '',
      readerColor: '',
      details: '',
    }

    let errors = false

    if (equipNotHasProp('equipTypeId') || !equip.equipTypeId) {
      errors = true
      field.equipTypeId = true
      message.equipTypeId = 'Por favor selecione o tipo de equipamento.'
    } else {
      const equipTypeReturned = await EquipType.findOne({
        where: { id: equip.equipTypeId },
        transaction,
      })

      if (!equipTypeReturned) {
        errors = true
        field.equipTypeId = true
        message.equipTypeId = 'Esse tipo de quipamento não existe.'
      }
    }

    if (equipNotHasProp('companyId') || !equip.companyId) {
      errors = true
      field.companyId = true
      message.companyId = 'Por favor selecione uma empresa.'
    } else {
      const companyReturned = await Company.findOne({
        where: { id: equip.companyId },
        transaction,
      })

      if (!companyReturned) {
        errors = true
        field.companyId = true
        message.companyId = 'Essa empresa não existe.'
      }
    }

    if (equipNotHasProp('serialNumber') || !equip.serialNumber) {
      errors = true
      field.serialNumber = true
      message.serialNumber = 'Por favor informe o número de série.'
    } else {
      const serialNumberReturned = await Equip.findOne({
        where: { serialNumber: equip.serialNumber },
        transaction,
      })

      if (serialNumberReturned) {
        errors = true
        field.companyId = true
        message.companyId = 'Esse equipamento já está cadastrado.'
      }
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const equipCreated = Equip.create(equip, { transaction })

    return equipCreated
  }
}
