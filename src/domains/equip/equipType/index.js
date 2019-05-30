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

    const field = {
      type: false,
      mark: false,
      model: false,
      description: false,
    }
    const message = {
      type: '',
      mark: '',
      model: '',
      description: '',
    }

    let errors = false

    if (equipTypeNotHasProp('type') || !equipType.type) {
      errors = true
      field.type = true
      message.type = 'Por favor informar o tipo do equipamento.'
    } else if (equipType.type !== 'catraca'
        && equipType.type !== 'relogio'
        && equipType.type !== 'controleAcesso'
        && equipType.type !== 'peca'
        && equipType.type !== 'sirene') {
      errors = true
      field.type = true
      message.type = 'Tipo inválido.'
    }

    if (equipTypeNotHasProp('mark') || !equipType.mark) {
      errors = true
      field.mark = true
      message.mark = 'Por favor informar a marca do equipamento.'
    }

    if (equipTypeNotHasProp('model') || !equipType.model) {
      errors = true
      field.model = true
      message.model = 'Por favor informar o modelo do equipamento.'
    }

    if (equipTypeNotHasProp('description')) {
      errors = true
    }

    if (equipType.type && equipType.mark && equipType.model) {
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
          errors = true
          field.model = true
          message.model = 'Equipamento já está cadastrado.'
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
          errors = true
          field.description = true
          message.description = 'Está peça deste equipamento já está registrada.'
        }
      }
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
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
