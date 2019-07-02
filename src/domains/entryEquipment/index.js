/* eslint-disable no-shadow */
const R = require('ramda')
const moment = require('moment')
const Cpf = require('@fnando/cpf/dist/node')

const formatQuery = require('../../helpers/lazyLoad')
const database = require('../../database')
const EquipDomain = require('../equip')

const { FieldValidationError } = require('../../helpers/errors')

const equipDomain = new EquipDomain()

const EntryEquipment = database.model('entryEquipment')
const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')
const Company = database.model('company')
const Equip = database.model('equip')
const Accessories = database.model('accessories')
const Process = database.model('process')

module.exports = class EntryEquipmentDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const entryEquipment = R.omit(['id', 'serialNumber'], bodyData)

    const entryEquipmentNotHasProp = prop => R.not(R.has(prop, entryEquipment))
    const entryEquipmentHasProp = prop => R.has(prop, entryEquipment)
    const bodyDataNotHasProp = prop => R.not(R.has(prop, bodyData))


    const field = {
      equipId: false,
      defect: true,
      externalDamage: false,
      delivery: false,
      clientName: false,
      RG: false,
      Cpf: false,
      senderName: false,
      properlyPacked: false,
      zipCode: false,
      state: false,
      city: false,
      neighborhood: false,
      street: false,
      number: false,
      motoboyName: false,
      responsibleName: false,
      technicianName: false,
    }
    const message = {
      equipId: '',
      defect: '',
      externalDamage: '',
      delivery: '',
      clientName: '',
      RG: '',
      Cpf: '',
      senderName: '',
      properlyPacked: '',
      zipCode: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      number: '',
      motoboyName: '',
      responsibleName: '',
      technicianName: '',
    }

    let errors = false

    const { serialNumber } = bodyData

    let equipReturned = null

    if (bodyDataNotHasProp('serialNumber') || !bodyData.serialNumber) {
      errors = true
      field.serialNumber = true
      message.serialNumber = 'Por favor digite o número de série.'
    } else {
      equipReturned = await equipDomain.getOneBySerialNumber(serialNumber)

      entryEquipment.equipId = equipReturned.id

      if (!equipReturned) {
        errors = true
        field.serialNumber = true
        message.serialNumber = 'Este equipamento não está registrado.'
      }
    }

    if (entryEquipmentNotHasProp('externalDamage')) {
      errors = true
      field.externalDamage = true
      message.externalDamage = 'Selecione sim ou não.'
    } else if (entryEquipment.externalDamage && !entryEquipment.details) {
      errors = true
      field.details = true
      message.details = 'Digite os danos externos.'
    }

    if (entryEquipmentNotHasProp('defect') || !entryEquipment.defect) {
      errors = true
      field.defect = true
      message.defect = 'Por favor informar o defeito.'
    }

    const client = () => {
      if (entryEquipmentNotHasProp('clientName') || !entryEquipment.clientName) {
        errors = true
        field.clientName = true
        message.clientName = 'Por favor informar o nome do cliente.'
      }
      if (entryEquipmentNotHasProp('RG') || !entryEquipment.RG) {
        errors = true
        field.Rg = true
        message.Rg = 'Por favor informar o RG.'
      }
      if (entryEquipmentNotHasProp('Cpf') || !entryEquipment.Cpf) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Por favor informar o Cpf.'
      } else if (!Cpf.isValid(entryEquipment.Cpf)) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Cpf inválido.'
      }
    }

    const sedex = () => {
      if (entryEquipmentNotHasProp('senderName') || !entryEquipment.senderName) {
        errors = true
        field.senderName = true
        message.senderName = 'Por favor informar o nome do remetente.'
      }
      if (entryEquipmentNotHasProp('properlyPacked') || !entryEquipment.properlyPacked) {
        errors = true
        field.properlyPacked = true
        message.properlyPacked = 'Por favor informar se está devidamente embalado.'
      }
      if (entryEquipmentNotHasProp('zipCode') || !entryEquipment.zipCode) {
        errors = true
        field.zipCode = true
        message.zipCode = 'Por favor informar o Cep.'
      }
      if (entryEquipmentNotHasProp('state') || !entryEquipment.state) {
        errors = true
        field.state = true
        message.state = 'Por favor informar o estado.'
      }
      if (entryEquipmentNotHasProp('city') || !entryEquipment.city) {
        errors = true
        field.city = true
        message.city = 'Por favor informar a cidade.'
      }
      if (entryEquipmentNotHasProp('neighborhood') || !entryEquipment.neighborhood) {
        errors = true
        field.neighborhood = true
        message.neighborhood = 'Por favor informar o bairro.'
      }
      if (entryEquipmentNotHasProp('street') || !entryEquipment.street) {
        errors = true
        field.street = true
        message.street = 'Por favor informar a rua.'
      }
      if (entryEquipmentNotHasProp('number') || !entryEquipment.number) {
        errors = true
        field.number = true
        message.number = 'Por favor informar o número.'
      }
    }

    const motoboy = () => {
      if (entryEquipmentNotHasProp('motoboyName') || !entryEquipment.motoboyName) {
        errors = true
        field.motoboyName = true
        message.motoboyName = 'Por favor informar o nome do motoboy.'
      }
      if (entryEquipmentNotHasProp('RG') || !entryEquipment.RG) {
        errors = true
        field.Rg = true
        message.Rg = 'Por favor informar o RG.'
      }
      if (entryEquipmentNotHasProp('Cpf') || !entryEquipment.Cpf) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Por favor informar o Cpf.'
      } else if (!Cpf.isValid(entryEquipment.Cpf)) {
        errors = true
        field.Cpf = true
        message.Cpf = 'Cpf inválido.'
      }
      if (entryEquipmentNotHasProp('responsibleName') || !entryEquipment.responsibleName) {
        errors = true
        field.responsibleName = true
        message.responsibleName = 'Por favor informar o nome do responsável.'
      }
      if (entryEquipmentNotHasProp('properlyPacked') || !entryEquipment.properlyPacked) {
        errors = true
        field.properlyPacked = true
        message.properlyPacked = 'Por favor informar se está devidamente embalado.'
      }
    }

    const externalTechnician = () => {
      if (entryEquipmentNotHasProp('technicianName') || !entryEquipment.technicianName) {
        errors = true
        field.technicianName = true
        message.technicianName = 'Por favor informar o nome do técnico externo.'
      }
      if (entryEquipmentNotHasProp('properlyPacked') || !entryEquipment.properlyPacked) {
        errors = true
        field.properlyPacked = true
        message.properlyPacked = 'Por favor informar se está devidamente embalado.'
      }
    }

    if (entryEquipmentNotHasProp('delivery')
      || (entryEquipment.delivery !== 'Cliente'
      && entryEquipment.delivery !== 'Sedex'
      && entryEquipment.delivery !== 'Motoboy'
      && entryEquipment.delivery !== 'Técnico externo')) {
      errors = true
      field.delivery = true
      message.delivery = 'Por favor informar como chegou.'
    } else if (entryEquipment.delivery === 'Cliente') {
      client()
    } else if (entryEquipment.delivery === 'Sedex') {
      sedex()
    } else if (entryEquipment.delivery === 'Motoboy') {
      motoboy()
    } else if (entryEquipment.delivery === 'Técnico externo') {
      externalTechnician()
    }

    if (entryEquipmentHasProp('RG')) {
      const { RG } = entryEquipment
      entryEquipment.RG = RG.replace(/\D/g, '')
    }
    if (entryEquipmentHasProp('Cpf')) {
      const { Cpf } = entryEquipment
      entryEquipment.Cpf = Cpf.replace(/\D/g, '')
    }
    if (entryEquipmentHasProp('zipCode')) {
      const { zipCode } = entryEquipment
      entryEquipment.zipCode = zipCode.replace(/\D/g, '')
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }


    const process = {
      status: 'preAnalise',
    }

    const processCreated = await Process.create(process, { transaction })

    entryEquipment.processId = processCreated.id


    const entryEquipmentCreated = await EntryEquipment.create(entryEquipment, { transaction })


    if (R.has('accessories', bodyData)) {
      const { accessories } = bodyData

      await entryEquipmentCreated.addAccessories(accessories, { transaction })
    }

    const response = await EntryEquipment.findByPk(entryEquipmentCreated.id, {
      include: [
        {
          model: Equip,
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
        },
        {
          model: Accessories,
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
      direction: 'ASC',
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

    const entry = await EntryEquipment.findAndCountAll({
      where: getWhere('entryEquipment'),
      order: [
        [newOrder.field, newOrder.direction],
      ],
      include: [
        {
          model: Equip,
          include: [{
            model: EquipModel,
            include: [{
              model: EquipMark,
              include: [{
                model: EquipType,
              }],
            }],
          }],
        },
        { model: Accessories },
      ],
      limit,
      offset,
      transaction,
    })

    const { rows } = entry

    const formatDateFunct = (date) => {
      moment.locale('pt-br')
      const formatDate = moment(date).format('L')
      const formatHours = moment(date).format('LT')
      const dateformated = `${formatDate} ${formatHours}`
      return dateformated
    }

    const extrectAccessories = (accessories) => {
      let Accessories = []
      if (accessories) {
        Accessories = accessories.map(item => item.accessories)
      }
      return Accessories
    }

    const formatData = R.map((comp) => {
      const resp = {
        externalDamage: comp.externalDamage,
        detailsDamage: comp.details,
        defect: comp.defect,
        observation: comp.observation,
        serialNumber: comp.equip.serialNumber,
        readerColor: comp.equip.readerColor,
        details: comp.equip.details,
        model: comp.equip.equipModel.model,
        description: comp.equip.equipModel.description,
        mark: comp.equip.equipModel.equipMark.mark,
        type: comp.equip.equipModel.equipMark.equipType.type,
        accessories: extrectAccessories(comp.accessories),
        createdAt: formatDateFunct(comp.createdAt),
        updatedAt: formatDateFunct(comp.updatedAt),
      }
      return resp
    })

    const entryList = formatData(rows)

    let show = limit
    if (entry.count < show) {
      show = entry.count
    }

    const response = {
      page: pageResponse,
      show,
      count: entry.count,
      rows: entryList,
    }
    return response
  }
}
