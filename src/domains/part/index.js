const R = require('ramda')
const moment = require('moment')

const formatQuery = require('../../helpers/lazyLoad')
const database = require('../../database')

const { FieldValidationError } = require('../../helpers/errors')

const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')
const Part = database.model('part')


module.exports = class PartDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const part = R.omit(['id', 'equipModels'], bodyData)

    const partNotHasProp = prop => R.not(R.has(prop, part))
    const partHasProp = prop => R.has(prop, part)

    const field = {
      item: false,
      costPrice: false,
      salePrice: false,
      equipModels: false,
      mark: false,
      modelListCard: false,
      part: false,
    }
    const message = {
      item: '',
      costPrice: '',
      salePrice: '',
      equipModels: '',
      mark: '',
      modelListCard: '',
      part: '',
    }

    let errors = false

    if (partNotHasProp('item') || !part.item) {
      errors = true
      field.item = true
      message.item = 'Por favor digite o item.'
    }

    if (partNotHasProp('costPrice') || !part.costPrice) {
      errors = true
      field.costPrice = true
      message.costPrice = 'Por favor digite o preço de custo.'
    } else {
      const { costPrice } = part
      part.costPrice = costPrice.replace(/\D/g, '')
    }

    if (partNotHasProp('salePrice') || !part.salePrice) {
      errors = true
      field.salePrice = true
      message.salePrice = 'Por favor digite o preço de venda.'
    } else {
      const { salePrice } = part
      part.salePrice = salePrice.replace(/\D/g, '')
    }

    if (R.not(R.has('equipModels', bodyData)) || bodyData.equipModels.length === 0) {
      errors = true
      field.equipModels = true

      field.modelListCard = true
      message.modelListCard = 'Selecione ao menos um modelo.'
    }

    if (partHasProp('description') && partHasProp('item')) {
      const partReturned = await Part.findOne({
        where: {
          item: part.item,
          description: part.description,
        },
        transaction,
      })

      if (partReturned) {
        errors = true
        field.item = true
        message.item = 'Peça já existe.'
      }
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const partCreated = await Part.create(part, { transaction })

    if (R.has('equipModels', bodyData) && bodyData.equipModels) {
      const { equipModels } = bodyData

      const equipModelsIds = equipModels.map(item => item.id)

      await partCreated.addEquipModels(equipModelsIds, { transaction })
    }


    const response = await Part.findByPk(partCreated.id, {
      include: [
        {
          model: EquipModel,
        },
      ],
      transaction,
    })

    return response
  }

  async updateByCostPrince(partId, options = {}) {
    const { transaction, newCostPrince } = options

    const partUpdating = await Part.findByPk(partId, { transaction })

    const newCostPrinceFormatted = newCostPrince.replace(/\D/g, '')

    const partUpdated = {
      ...partUpdating,
      costPrice: newCostPrinceFormatted,
    }

    partUpdating.costPrice = newCostPrince

    await partUpdating.update(partUpdated, { transaction })

    const response = await Part.findByPk(partId, {
      include: [
        {
          model: EquipModel,
        },
      ],
      transaction,
    })

    return response
  }

  async updateBySalePrice(partId, options = {}) {
    const { transaction, newSalePrice } = options

    const partUpdating = await Part.findByPk(partId, { transaction })

    const newSalePriceFormatted = newSalePrice.replace(/\D/g, '')

    const partUpdated = {
      ...partUpdating,
      salePrice: newSalePriceFormatted,
    }

    partUpdating.salePrice = newSalePrice

    await partUpdating.update(partUpdated, { transaction })

    const response = await Part.findByPk(partId, {
      include: [
        {
          model: EquipModel,
        },
      ],
      transaction,
    })

    return response
  }

  async getAllParts(options = {}) {
    const inicialOrder = {
      field: 'createdAt',
      acendent: true,
      direction: 'DESC',
    }

    const { query = null, transaction = null } = options

    const newQuery = Object.assign({}, query)
    const newOrder = (query && query.order) ? query.order : inicialOrder

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


    const parts = await Part.findAndCountAll({
      where: getWhere('part'),
      include: [{
        model: EquipModel,
        where: getWhere('equipModel'),
        // where: { model: 'Samsung 2.0' },
        // include: [{
        //   model: EquipMark,
        //   // where: getWhere('equipMark'),
        //   // where: { mark: 'Samsung' },
        //   include: [{
        //     model: EquipType,
        //     // where: { type: 'catraca' },
        //     // where: getWhere('equipType'),
        //   }],
        // }],
      }],
      order: [
        [newOrder.field, newOrder.direction],
      ],
      limit,
      offset,
      transaction,
    })

    const { rows } = parts

    const formatDateFunct = (date) => {
      moment.locale('pt-br')
      const formatDate = moment(date).format('L')
      const formatHours = moment(date).format('LT')
      const dateformated = `${formatDate} ${formatHours}`
      return dateformated
    }

    const formatData = R.map((comp) => {
      const resp = {
        item: comp.item,
        description: comp.description,
        costPrice: comp.costPrice,
        salePrice: comp.salePrice,
        equipModels: comp.equipModels,
        createdAt: formatDateFunct(comp.createdAt),
        updatedAt: formatDateFunct(comp.updatedAt),
      }
      return resp
    })

    const partsList = formatData(rows)

    let show = limit
    if (parts.count < show) {
      show = parts.count
    }

    const response = {
      page: pageResponse,
      show,
      count: parts.count,
      rows: partsList,
    }
    return response
  }
}
