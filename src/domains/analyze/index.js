const R = require('ramda')

const database = require('../../database')

const AnalysisPartDomain = require('./analysisPart')

// const { FieldValidationError } = require('../../helpers/errors')

const analysisPartDomain = new AnalysisPartDomain()

const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')
const AnalysisPart = database.model('analysisPart')
const Part = database.model('part')
const Analyze = database.model('analyze')


module.exports = class AnalyzeDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const analyze = R.omit(['id'], bodyData)

    const analyzeCreated = await Analyze.create(analyze, { transaction })

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

    if (updatesHasProp('status') && updates.status) {
      updatedAnalyze.status = updates.status
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
