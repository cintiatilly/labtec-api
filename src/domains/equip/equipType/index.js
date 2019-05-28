const R = require('ramda')

const formatQuery = require('../../../helpers/lazyLoad')
const database = require('../../../database')

const { FieldValidationError } = require('../../../helpers/errors')

const EquipType = database.model('equipType')

module.exports = class EquipTypeDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const equipType = R.omit(['id'], bodyData)

    const equipTypeNotHasProp = prop => R.not(R.has(prop, bodyData))

    if (equipTypeNotHasProp('type') || !equipType.type) {
      throw new FieldValidationError([{
        field: 'type',
        message: 'type is required',
      }])
    }

    if (equipTypeNotHasProp('mark') || !equipType.mark) {
      throw new FieldValidationError([{
        field: 'mark',
        message: 'mark is required',
      }])
    }

    if (equipTypeNotHasProp('model') || !equipType.model) {
      throw new FieldValidationError([{
        field: 'model',
        message: 'model is required',
      }])
    }

    if (equipTypeNotHasProp('description')) {
      throw new FieldValidationError([{
        field: 'description',
        message: 'property description is required',
      }])
    }

    if (equipType.type !== 'catraca'
      && equipType.type !== 'relogio'
      && equipType.type !== 'controleAcesso'
      && equipType.type !== 'peca'
      && equipType.type !== 'sirene') {
      throw new FieldValidationError([{
        field: 'type',
        message: 'type is invalid',
      }])
    }

    if (equipType.type !== 'peca') {
      const modelHasExist = await EquipType.findOne({
        where: {
          type: equipType.type,
          mark: equipType.mark,
          model: equipType.model,
        },
        transaction,
      })

      if (modelHasExist) {
        throw new FieldValidationError([{
          field: 'model',
          message: 'equipType alread exist',
        }])
      }
    } else {
      const pecaHasExist = await EquipType.findOne({
        where: {
          mark: equipType.mark,
          model: equipType.model,
          description: equipType.description,
        },
        transaction,
      })

      if (pecaHasExist) {
        throw new FieldValidationError([{
          field: 'description',
          message: 'peca alread exist',
        }])
      }
    }

    const equipTypeCreated = EquipType.create(equipType, { transaction })

    return equipTypeCreated
  }

  async getAll(options = {}) {
    const inicialOrder = {
      field: 'createdAt',
      acendent: true,
      direction: 'DESC',
    }

    const { query = null, order = null, transaction = null } = options

    const newQuery = Object.assign({}, query)
    const newOrder = Object.assign(inicialOrder, order)

    if (newOrder.acendent) {
      newOrder.direction = 'DESC'
    } else {
      newOrder.direction = 'ASC'
    }

    const {
      getWhere,
      limit,
      offset,
      pageResponse,
    } = formatQuery(newQuery)

    const equipTypes = await EquipType.findAndCountAll({
      where: getWhere('equipType'),
      order: [
        [newOrder.field, newOrder.direction],
      ],
      limit,
      offset,
      transaction,
    })

    const { rows } = equipTypes

    const formatData = R.map((equip) => {
      const resp = {
        type: equip.type,
        mark: equip.mark,
        model: equip.model,
        description: equip.description,
      }
      return resp
    })

    const equipTypesList = formatData(rows)


    const response = {
      page: pageResponse,
      show: limit,
      count: equipTypes.count,
      rows: equipTypesList,
    }
    return response
  }
}
