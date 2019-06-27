const R = require('ramda')

const database = require('../../../database')

const { FieldValidationError } = require('../../../helpers/errors')

const TypeAccount = database.model('typeAccount')
const Resources = database.model('resources')

module.exports = class TypeAccountDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const typeAccount = R.omit([
      'id',
      'addCompany',
      'addPart',
      'addAnalyze',
      'addEquip',
      'addEntry',
    ], bodyData)

    const resources = R.omit([
      'id',
      'typeName',
    ], bodyData)

    const typeAccountNotHasProp = prop => R.not(R.has(prop, typeAccount))

    const field = {
      typeName: false,
      addCompany: false,
      addPart: false,
      addAnalyze: false,
      addEquip: false,
      addEntry: false,
    }
    const message = {
      typeName: '',
      addCompany: '',
      addPart: '',
      addAnalyze: '',
      addEquip: '',
      addEntry: '',
    }

    let errors = false

    if (typeAccountNotHasProp('typeName') || !typeAccount.typeName) {
      errors = true
      field.typeName = true
      message.typeName = 'Por favor informar o tipo de conta.'
    } else {
      const typeAccountReturned = await TypeAccount.findOne({
        where: { typeName: typeAccount.typeName },
        transaction,
      })

      if (typeAccountReturned) {
        errors = true
        field.typeName = true
        message.typeName = 'Essa tipo de conta já existe em nosso sistema.'
      }
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const typeAccountCreated = await TypeAccount.create(typeAccount, { transaction })

    resources.typeAccountId = typeAccountCreated.id

    await Resources.create(resources, { transaction })

    const response = await TypeAccount.findByPk(typeAccountCreated.id, {
      include: [{
        model: Resources,
      }],
      transaction,
    })

    return response
  }
}
