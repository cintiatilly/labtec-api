const R = require('ramda')

const formatQuery = require('../../../helpers/lazyLoad')
const database = require('../../../database')

const { FieldValidationError } = require('../../../helpers/errors')

const EquipType = database.model('equipType')
const EquipMark = database.model('equipMark')


module.exports = class EquipTypeDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const equip = R.omit(['id'], bodyData)

    const equipNotHasProp = prop => R.not(R.has(prop, bodyData))

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

    if (equipNotHasProp('type') || !equip.type) {
      errors = true
      field.type = true
      message.type = 'Por favor informar o tipo do equipamento.'
    } else if (equip.type !== 'catraca'
        && equip.type !== 'relogio'
        && equip.type !== 'controleAcesso'
        && equip.type !== 'peca'
        && equip.type !== 'sirene') {
      errors = true
      field.type = true
      message.type = 'Tipo inválido.'
    }

    if (equipNotHasProp('mark') || !equip.mark) {
      errors = true
      field.mark = true
      message.mark = 'Por favor informar a marca do equipamento.'
    }

    if (equipNotHasProp('model') || !equip.model) {
      errors = true
      field.model = true
      message.model = 'Por favor informar o modelo do equipamento.'
    }

    if (equipNotHasProp('description')) {
      errors = true
    }

    // if (equip.type && equip.mark && equip.model) {
    //   if (equip.type !== 'peca') {
    //     const modelHasExist = await Equip.findOne({
    //       where: {
    //         type: equip.type,
    //         mark: equip.mark,
    //         model: equip.model,
    //       },
    //       transaction,
    //     })

    //     if (modelHasExist) {
    //       errors = true
    //       field.model = true
    //       message.model = 'Equipamento já está cadastrado.'
    //     }
    //   } else {
    //     const pecaHasExist = await Equip.findOne({
    //       where: {
    //         mark: equip.mark,
    //         model: equip.model,
    //         description: equip.description,
    //       },
    //       transaction,
    //     })

    //     if (pecaHasExist) {
    //       errors = true
    //       field.description = true
    //       message.description = 'Está peça deste equipamento já está registrada.'
    //     }
    //   }
    // }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const equipMark = {
      mark: equip.mark,
      model: equip.model,
      description: equip.description,
    }

    const equipMarkCreated = await EquipMark.create(equipMark, { transaction })

    const equipType = {
      type: equip.type,
      equipMarkId: equipMarkCreated.id,
    }

    const equipTypeCreated = await EquipType.create(equipType, { transaction })

    const response = await EquipType.findByPk(equipTypeCreated.id, {
      include: [
        {
          model: EquipMark,
          // include: [{
          //   model: EquipModel,
          // }],
        },
      ],
      transaction,
    })

    return response
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
