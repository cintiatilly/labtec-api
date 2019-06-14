const R = require('ramda')

const database = require('../../../database')

const { FieldValidationError } = require('../../../helpers/errors')

// const EquipModel = database.model('equipModel')
// const EquipMark = database.model('equipMark')
// const EquipType = database.model('equipType')
// const Company = database.model('company')
// const Equip = database.model('equip')
const Part = database.model('part')
const AnalysisPart = database.model('analysisPart')
const Analyze = database.model('analyze')
const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')


module.exports = class AnalysisPartDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const analysisPart = R.omit(['id'], bodyData)

    const analysisPartNotHasProp = prop => R.not(R.has(prop, analysisPart))

    const field = {
      partId: false,
      analyzeId: false,
      description: false,
    }
    const message = {
      partId: '',
      analyzeId: '',
      description: '',
    }

    let errors = false

    if (analysisPartNotHasProp('partId') || !analysisPart.partId) {
      errors = true
      field.partId = true
      message.partId = 'Por favor selecione uma peça.'
    } else {
      const analysisPartReturned = await Part.findOne({
        where: { id: analysisPart.partId },
        transaction,
      })

      if (!analysisPartReturned) {
        errors = true
        field.partId = true
        message.partId = 'Essa peça não existe.'
      }
    }

    if (analysisPartNotHasProp('description') || !analysisPart.description) {
      errors = true
      field.description = true
      message.description = 'Campo descrição obrigatório.'
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const analysisPartCreated = await AnalysisPart.create(analysisPart, { transaction })


    const response = await AnalysisPart.findByPk(analysisPartCreated.id, {
      include: [
        {
          model: Part,
          include: [{
            model: EquipModel,
            include: [{
              model: EquipMark,
              include: [{
                model: EquipType,
              }],
            }],
          }],
        },
      ],
      transaction,
    })

    // console.log(JSON.stringify(response))
    return response
  }
}
