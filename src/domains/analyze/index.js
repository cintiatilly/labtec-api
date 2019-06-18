const R = require('ramda')

const database = require('../../database')

const AnalysisPartDomain = require('./analysisPart')

const { FieldValidationError } = require('../../helpers/errors')

const analysisPartDomain = new AnalysisPartDomain()

const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')
const AnalysisPart = database.model('analysisPart')
const Part = database.model('part')
const Analyze = database.model('analyze')
const Process = database.model('process')


module.exports = class AnalyzeDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const analyze = R.omit(['id'], bodyData)

    const analyzeNotHasProp = prop => R.not(R.has(prop, bodyData))
    const analyzeHasProp = prop => R.has(prop, bodyData)

    const field = {
      garantia: false,
      conditionType: false,
      processId: false,
    }
    const message = {
      garantia: '',
      conditionType: '',
      processId: '',
    }

    let errors = false

    if (analyzeNotHasProp('garantia') || !analyze.garantia) {
      errors = true
      field.garantia = true
      message.garantia = 'Por favor informar o tipo de garantia.'
    }

    if (analyzeNotHasProp('conditionType') || !analyze.conditionType) {
      errors = true
      field.conditionType = true
      message.conditionType = 'Por favor informar o tipo de condição.'
    }

    if (analyzeHasProp('processId')) {
      if (!analyze.processId) {
        errors = true
        field.processId = true
        message.processId = 'Id não pode ser nulo.'
      } else {
        const processHasExist = await Process.findByPk(analyze.processId, { transaction })

        if (!processHasExist) {
          errors = true
          field.processId = true
          message.processId = 'Id não existe em processos'
        }
      }
    }

    const analyzeCreated = await Analyze.create(analyze, { transaction })

    const analyzeNotHasProp = prop => R.not(R.has(prop, bodyData))

    const field = {
      garantia: false,
      conditionType: false,
    }
    const message = {
      garantia: '',
      conditionType: '',
    }

    let errors = false
    
    if (analyzeNotHasProp('garantia') || !analyze.garantia) {
      errors = true
      field.garantia = true
      message.garantia = 'Por favor informar o tipo de garantia.'
    }

    if (analyzeNotHasProp('conditionType') || !analyze.conditionType) {
      errors = true
      field.conditionType = true
      message.conditionType = 'Por favor informar o tipo de condição.'
    }

    if (bodyData) {
      const bodyHasProp = prop => R.has(prop, bodyData)


      if (bodyHasProp('analysisPart')) {
        const { analysisPart } = bodyData


        const analysisPartCreatedPromises = analysisPart.map((item) => {
          const analysisPartBody = {
            ...item,
            analyzeId: analyzeCreated.id,
          }
          return analysisPartDomain.add(analysisPartBody, { transaction })
        })

        const analysisPartCreatedList = await Promise.all(analysisPartCreatedPromises)

        await analyzeCreated.addAnalysisParts(analysisPartCreatedList, { transaction })
      }
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }


    const response = await Analyze.findByPk(analyzeCreated.id, {
      include: [
        {
          model: AnalysisPart,
          include: [{
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
          }],
        },
      ],
      transaction,
    })

    return response
  }

  async analyzeUpdate(id, body, options = {}) {
    const { transaction = null } = options

    const updates = R.omit(['id'], body)

    const updatesHasProp = prop => R.has(prop, updates)

    const analyze = await Analyze.findByPk(id, { transaction })

    const updatedAnalyze = {
      ...analyze,
    }

    if (updatesHasProp('budgetStatus') && updates.budgetStatus) {
      updatedAnalyze.budgetStatus = updates.budgetStatus
    }

    await analyze.update(updatedAnalyze, { transaction })

    const response = await Analyze.findByPk(id, {
      include: [
        {
          model: AnalysisPart,
          include: [{
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
          }],
        },
      ],
      transaction,
    })

    return response
  }
}
