const R = require('ramda')

const formatQuery = require('../../../helpers/lazyLoad')
const database = require('../../../database')

const { FieldValidationError } = require('../../../helpers/errors')

const EquipType = database.model('equipType')
const EquipMark = database.model('equipMark')
const EquipModel = database.model('equipModel')


module.exports = class EquipTypeDomain {
  async addMark(bodyData, options = {}) {
    const { transaction = null } = options

    const equip = R.omit(['id'], bodyData)

    const equipNotHasProp = prop => R.not(R.has(prop, bodyData))

    const field = {
      type: false,
      mark: false,
    }
    const message = {
      type: '',
      mark: '',
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


    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const equipType = {
      type: equip.type,
    }

    let typeHasExist = await EquipType.findOne({
      where: {
        type: equipType.type,
      },
      transaction,
    })

    if (!typeHasExist) {
      typeHasExist = await EquipType.create(equipType, { transaction })
    }

    const equipMark = {
      mark: equip.mark,
      equipTypeId: typeHasExist.id,
    }

    let markHasExist = await EquipMark.findOne({
      where: {
        mark: equipMark.mark,
      },
      include: [{
        model: EquipType,
        where: { id: equipMark.equipTypeId },
      }],
      transaction,
    })

    if (markHasExist) {
      errors = true
      field.mark = true
      message.mark = 'Marca já está cadastrada.'
    } else {
      markHasExist = await EquipMark.create(equipMark, { transaction })
    }

    const response = await EquipMark.findByPk(markHasExist.id, {
      include: [{
        model: EquipType,
      }],
      transaction,
    })

    return response
  }


  async addModel(bodyData, options = {}) {
    const { transaction = null } = options

    const equip = R.omit(['id'], bodyData)

    const equipNotHasProp = prop => R.not(R.has(prop, bodyData))

    const field = {
      equipMarkId: false,
      model: false,
      description: false,
    }
    const message = {
      equipMarkId: '',
      model: '',
      description: '',
    }

    let errors = false


    if (equipNotHasProp('equipMarkId') || !equip.equipMarkId) {
      errors = true
      field.equipMarkId = true
      message.equipMarkId = 'Por favor informar a marca do equipamento.'
    }

    if (equipNotHasProp('model') || !equip.model) {
      errors = true
      field.model = true
      message.model = 'Por favor informar o modelo do equipamento.'
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }


    const markHasExist = await EquipMark.findByPk(equip.equipMarkId, {
      include: [{
        model: EquipType,
      }],
      transaction,
    })

    if (!markHasExist) {
      errors = true
      field.mark = true
      message.mark = 'Marca não existe.'
    }

    const equipModel = {
      model: equip.model,
      description: equip.description,
      equipMarkId: markHasExist.id,
    }

    let modelHasExist = await EquipModel.findOne({
      where: {
        model: equipModel.model,
      },
      include: [{
        model: EquipMark,
        where: { id: equipModel.equipMarkId },
        include: [{
          model: EquipType,
        }],
      }],
      transaction,
    })

    if (modelHasExist) {
      const { type } = modelHasExist.equipMark.equipType

      if (type === 'peca') {
        const pecaHasExist = await EquipModel.findOne({
          where: {
            model: equipModel.model,
            description: equipModel.description,
          },
          include: [{
            model: EquipMark,
            include: [{
              model: EquipType,
            }],
          }],
          transaction,
        })
        if (pecaHasExist) {
          field.equipType = true
          message.equipType = 'Este equipamento já está registrado.'
          throw new FieldValidationError([{ field, message }])
        } else {
          modelHasExist = await EquipModel.create(equipModel, { transaction })
        }
      } else {
        field.equipType = true
        message.equipType = 'Este equipamento já está registrado.'
        throw new FieldValidationError([{ field, message }])
      }
    } else {
      modelHasExist = await EquipModel.create(equipModel, { transaction })
    }


    const response = await EquipModel.findByPk(modelHasExist.id, {
      include: [{
        model: EquipMark,
        include: [{
          model: EquipType,
        }],
      }],
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

    const equipModels = await EquipModel.findAndCountAll({
      where: getWhere('equipModel'),
      include: [{
        model: EquipMark,
        include: [{
          model: EquipType,
        }],
      }],
      order: [
        [newOrder.field, newOrder.direction],
      ],
      limit,
      offset,
      transaction,
    })

    const { rows } = equipModels

    const formatData = R.map((equip) => {
      const resp = {
        type: equip.equipMark.equipType.type,
        mark: equip.equipMark.mark,
        model: equip.model,
        description: equip.description,
      }
      return resp
    })

    const equipModelsList = formatData(rows)


    const response = {
      page: pageResponse,
      show: limit,
      count: equipModels.count,
      rows: equipModelsList,
    }
    return response
  }

  async getAllMarkByType(type, options = {}) {
    const { transaction = null } = options

    const arrayMarks = await EquipMark.findAll({
      include: [{
        model: EquipType,
        where: { type },
      }],
      transaction,
    })

    const response = arrayMarks.map(item => item.mark)

    return response
  }

  async getAllModelByMark(mark, options = {}) {
    const { transaction = null } = options

    const arrayModel = await EquipModel.findAll({
      include: [{
        model: EquipMark,
        where: { mark },
      }],
      transaction,
    })

    const response = arrayModel.map(item => item.model)

    return response
  }
}
