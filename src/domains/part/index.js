const R = require('ramda')

const database = require('../../database')

const { FieldValidationError } = require('../../helpers/errors')

const EquipModel = database.model('equipModel')
const Part = database.model('part')


module.exports = class PartDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const part = R.omit(['id', 'equipModels'], bodyData)

    const partNotHasProp = prop => R.not(R.has(prop, part))

    const field = {
      item: false,
      costPrice: false,
      salePrice: false,
      equipModels: false,
    }
    const message = {
      item: '',
      costPrice: '',
      salePrice: '',
      equipModels: '',
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
      part.costPrice = costPrice.replace(/\D/, '')
    }

    if (partNotHasProp('salePrice') || !part.salePrice) {
      errors = true
      field.salePrice = true
      message.salePrice = 'Por favor digite o preço de venda.'
    } else {
      const { salePrice } = part
      part.salePrice = salePrice.replace(/\D/, '')
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const partCreated = await Part.create(part, { transaction })

    if (R.has('equipModels', bodyData) && bodyData.equipModels) {
      const { equipModels } = bodyData

      await partCreated.addEquipModels(equipModels, { transaction })
    } else {
      errors = true
      field.equipModels = true
      message.equipModels = 'Por favor selecione pelo menos um equipamento.'
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

    const newCostPrinceFormatted = newCostPrince.replace(/\D/, '')

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

    const newSalePriceFormatted = newSalePrice.replace(/\D/, '')

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
}
