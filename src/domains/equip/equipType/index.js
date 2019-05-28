const R = require('ramda')
// const moment = require('moment')

// const formatQuery = require('../../../helpers/lazyLoad')
const database = require('../../../database')

const { FieldValidationError } = require('../../../helpers/errors')

const EquipType = database.model('equipType')

module.exports = class equipTypeDomain {
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

    const equipTypeCreated = EquipType.create(equipType, { transaction })

    return equipTypeCreated
  }

  // async getAll(options = {}) {
  //   const inicialOrder = {
  //     field: 'createdAt',
  //     acendent: true,
  //     direction: 'DESC',
  //   }

  //   const { query = null, order = null, transaction = null } = options

  //   const newQuery = Object.assign({}, query)
  //   const newOrder = Object.assign(inicialOrder, order)

  //   if (newOrder.acendent) {
  //     newOrder.direction = 'DESC'
  //   } else {
  //     newOrder.direction = 'ASC'
  //   }

  //   const {
  //     getWhere,
  //     limit,
  //     offset,
  //     pageResponse,
  //   } = formatQuery(newQuery)

  //   const companies = await equipType.findAndCountAll({
  //     where: getWhere('equipType'),
  //     order: [
  //       [newOrder.field, newOrder.direction],
  //     ],
  //     limit,
  //     offset,
  //     transaction,
  //   })

  //   const { rows } = companies

  //   const formatDateFunct = (date) => {
  //     moment.locale('pt-br')
  //     const formatDate = moment(date).format('L')
  //     const formatHours = moment(date).format('LT')
  //     const dateformated = `${formatDate} ${formatHours}`
  //     return dateformated
  //   }

  //   const formatData = R.map((comp) => {
  //     const resp = {
  //       cnpj: comp.cnpj,
  //       razaoSocial: comp.razaoSocial,
  //       createdAt: formatDateFunct(comp.createdAt),
  //       updatedAt: formatDateFunct(comp.updatedAt),
  //       nameContact: comp.nameContact,
  //       telphone: comp.telphone,
  //     }
  //     return resp
  //   })

  //   const companiesList = formatData(rows)


  //   const response = {
  //     page: pageResponse,
  //     show: limit,
  //     count: companies.count,
  //     rows: companiesList,
  //   }
  //   return response
  // }
}
