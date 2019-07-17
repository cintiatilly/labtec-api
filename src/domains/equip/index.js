const R = require('ramda')
const moment = require('moment')

const formatQuery = require('../../helpers/lazyLoad')

const database = require('../../database')

const { FieldValidationError } = require('../../helpers/errors')

const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')
const Company = database.model('company')
const Equip = database.model('equip')


module.exports = class EquipDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const equip = R.omit(['id'], bodyData)

    const equipNotHasProp = prop => R.not(R.has(prop, equip))

    const field = {
      equipModelId: false,
      companyId: false,
      serialNumber: false,
      readerColor: false,
      details: false,
    }
    const message = {
      equipModelId: '',
      companyId: '',
      serialNumber: '',
      readerColor: '',
      details: '',
    }

    let errors = false

    if (equipNotHasProp('equipModelId') || !equip.equipModelId) {
      errors = true
      field.equipModelId = true
      message.equipModelId = 'Por favor selecione o modelo de equipamento.'
    } else {
      const equipModelReturned = await EquipModel.findOne({
        where: { id: equip.equipModelId },
        transaction,
      })

      if (!equipModelReturned) {
        errors = true
        field.equipModelId = true
        message.equipModelId = 'Esse tipo de quipamento não existe.'
      }
    }

    if (equipNotHasProp('companyId') || !equip.companyId) {
      errors = true

      field.cnpj = true
      message.cnpj = 'Cnpj não cadastrado'

      field.companyId = true
      message.companyId = 'Por favor selecione uma empresa.'
    } else {
      const companyReturned = await Company.findOne({
        where: { id: equip.companyId },
        transaction,
      })

      if (!companyReturned) {
        errors = true
        field.companyId = true
        message.companyId = 'Essa empresa não existe.'
      }
    }

    if (equipNotHasProp('serialNumber') || !equip.serialNumber) {
      errors = true
      field.serialNumber = true
      message.serialNumber = 'Por favor informe o número de série.'
    } else {
      const serialNumberReturned = await Equip.findOne({
        where: { serialNumber: equip.serialNumber },
        transaction,
      })

      if (serialNumberReturned) {
        errors = true
        field.serialNumber = true
        message.serialNumber = 'Esse equipamento já está cadastrado.'
      }
    }

    // if (equipNotHasProp('readerColor')
    // || (equip.readerColor !== 'Branco'
    // && equip.readerColor !== 'Vermelho'
    // && equip.readerColor !== 'Azul'
    // && equip.readerColor !== 'Verde'
    // && equip.readerColor !== 'DedoVivo'
    // && equip.readerColor !== 'BioLFD'
    // && equip.readerColor !== 'BioLC'
    // && equip.readerColor !== 'NaoSeAplica')) {
    //   errors = true
    //   field.readerColor = true
    //   message.readerColor = 'leitor inválido.'
    // }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    const equipCreated = await Equip.create(equip, { transaction })

    const response = await Equip.findByPk(equipCreated.id, {
      include: [
        {
          model: Company,
        },
        {
          model: EquipModel,
          include: [
            {
              model: EquipMark,
              include: [{
                model: EquipType,
              }],
            },
          ],
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

    const equips = await Equip.findAndCountAll({
      where: getWhere('equip'),
      include: [
        {
          model: Company,
          where: getWhere('company'),
        },
        {
          model: EquipModel,
          where: getWhere('equipModel'),
          include: [{
            model: EquipMark,
            where: getWhere('equipMark'),
            include: [{
              model: EquipType,
              where: getWhere('equipType'),
            }],
          }],
        },
      ],
      order: [
        [newOrder.field, newOrder.direction],
      ],
      limit,
      offset,
      transaction,
    })

    const { rows } = equips

    const formatDateFunct = (date) => {
      moment.locale('pt-br')
      const formatDate = moment(date).format('L')
      const formatHours = moment(date).format('LT')
      const dateformated = `${formatDate} ${formatHours}`
      return dateformated
    }

    const formatData = R.map((equip) => {
      const resp = {
        id: equip.id,
        companyId: equip.companyId,
        equipModelId: equip.equipModelId,
        razaoSocial: equip.company.razaoSocial,
        cnpj: equip.company.cnpj,
        street: equip.company.street,
        number: equip.company.number,
        city: equip.company.city,
        state: equip.company.state,
        neighborhood: equip.company.neighborhood,
        referencePoint: equip.company.referencePoint,
        zipCode: equip.company.zipCode,
        telphone: equip.company.telphone,
        email: equip.company.email,
        nameContact: equip.company.nameContact,
        type: equip.equipModel.equipMark.equipType.type,
        mark: equip.equipModel.equipMark.mark,
        model: equip.equipModel.model,
        description: equip.equipModel.description,
        serialNumber: equip.serialNumber,
        readerColor: equip.readerColor,
        details: equip.details,
        createdAt: formatDateFunct(equip.createdAt),
        updatedAt: formatDateFunct(equip.updatedAt),
      }
      return resp
    })

    const equipsList = formatData(rows)


    const response = {
      page: pageResponse,
      show: limit,
      count: equips.count,
      rows: equipsList,
    }
    return response
  }


  async update(bodyData, options = {}) {
    const { transaction = null } = options

    const equip = R.omit(['id'], bodyData)

    const equipNotHasProp = prop => R.not(R.has(prop, equip))

    const oldEquip = await Equip.findByPk(bodyData.id)

    const newEquip = {
      ...oldEquip,
    }

    const field = {
      type: false,
      mark: false,
      model: false,
      equipModelId: false,
      serialNumber: false,
      readerColor: false,
    }
    const message = {
      type: '',
      mark: '',
      model: '',
      equipModelId: '',
      serialNumber: '',
      readerColor: '',
    }

    let errors = false

    if (equipNotHasProp('serialNumber') || !equip.serialNumber) {
      errors = true
      field.serialNumber = true
      message.serialNumber = 'informe o número de série.'
    } else {
      const serialNumberReturned = await Equip.findOne({
        where: { serialNumber: equip.serialNumber },
        transaction,
      })

      if (serialNumberReturned && equip.serialNumber !== oldEquip.serialNumber) {
        errors = true
        field.serialNumber = true
        message.serialNumber = 'já está cadastrado.'
      }
    }

    if (equipNotHasProp('readerColor')
    || (equip.readerColor !== 'Branco'
    && equip.readerColor !== 'Vermelho'
    && equip.readerColor !== 'Azul'
    && equip.readerColor !== 'Verde'
    && equip.readerColor !== 'DedoVivo'
    && equip.readerColor !== 'BioLFD'
    && equip.readerColor !== 'BioLC'
    && equip.readerColor !== 'NaoSeAplica')) {
      errors = true
      field.readerColor = true
      message.readerColor = 'leitor inválido.'
    }

    if (equipNotHasProp('type') || !equip.type) {
      errors = true
      field.type = true
      message.type = 'informe o tipo.'
    }

    if (equipNotHasProp('mark') || !equip.mark) {
      errors = true
      field.mark = true
      message.mark = 'informe a marca.'
    }

    if (equipNotHasProp('model') || !equip.model) {
      errors = true
      field.model = true
      message.model = 'informe o modelo.'
    }

    const equipModel = await EquipModel.findOne({
      where: { model: equip.model },
      include: [{
        model: EquipMark,
        where: { mark: equip.mark },
        include: [{
          model: EquipType,
          where: { type: equip.type },
        }],
      }],
    })

    if (!equipModel) {
      errors = true
      field.model = true
      message.model = 'Modelo não encontrado.'
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    newEquip.equipModelId = equip.equipModelId
    newEquip.serialNumber = equip.serialNumber
    newEquip.readerColor = equip.readerColor

    const response = await oldEquip.update(newEquip, { transaction })

    return response
  }


  async getOneBySerialNumber(serialNumber, options = {}) {
    const { transaction = null } = options
    const response = await Equip.findOne({
      where: {
        serialNumber,
      },
      include: [
        {
          model: Company,
        },
        {
          model: EquipModel,
          include: [{
            model: EquipMark,
            include: [{
              model: EquipType,
            }],
          }],
        },
      ],
      transaction,
    })

    return response
  }
}
