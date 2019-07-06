const R = require('ramda')
const moment = require('moment')

const formatQuery = require('../../helpers/lazyLoad')
const database = require('../../database')

const { FieldValidationError } = require('../../helpers/errors')

const EntryEquipment = database.model('entryEquipment')
const Process = database.model('process')
const Time = database.model('time')
const EquipModel = database.model('equipModel')
const EquipMark = database.model('equipMark')
const EquipType = database.model('equipType')
const Company = database.model('company')
const Equip = database.model('equip')

module.exports = class ProcessDomain {
  async update(id, bodyData, options = {}) {
    const { transaction = null } = options

    const updates = R.omit(['id'], bodyData)

    const updatesHasProp = prop => R.has(prop, updates)

    const process = await Process.findByPk(id, { transaction })

    const updatedProcess = {
      ...process,
    }

    const field = {
      status: false,
    }
    const message = {
      status: '',
    }

    let errors = false


    const arrayStatus = ['preAnalise', 'analise', 'fabrica',
      'revisao1', 'posAnalise', 'revisao2', 'posAnalise2',
      'revisao3', 'orcamento', 'manutencao', 'revisaoFinal', 'estoque']

    if (updatesHasProp('status')) {
      if (arrayStatus.filter(value => value === updates.status)) {
        updatedProcess.status = updates.status
      } else {
        errors = true
        field.status = true
        message.status = 'status inválido.'
      }
    }

    if (errors) {
      throw new FieldValidationError([{ field, message }])
    }

    await process.update(updatedProcess, { transaction })

    const response = await Process.findByPk(id, {
      include: [{
        model: EntryEquipment,
      }],
      transaction,
    })

    const time = {
      processId: process.processId,
      status: process.status,
      init: process.updatedAt,
      end: moment(),
    }

    await Time.create(time, { transaction })

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

    const process = await Process.findAndCountAll({
      where: getWhere('process'),
      // where: { status: 'analise' },
      include: [{
        model: EntryEquipment,
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
        ],
      }],
      order: [
        [newOrder.field, newOrder.direction],
      ],
      limit,
      offset,
      transaction,
    })


    const { rows } = process

    const formatDateFunct = (date) => {
      moment.locale('pt-br')
      const formatDate = moment(date).format('L')
      const formatHours = moment(date).format('LT')
      const dateformated = `${formatDate} ${formatHours}`
      return dateformated
    }

    const formatData = R.map((comp) => {
      const resp = {
        status: comp.status,
        defect: comp.entryEquipment.defect,
        serialNumber: comp.entryEquipment.equip.serialNumber,
        razaoSocial: comp.entryEquipment.equip.company.razaoSocial,
        readerColor: comp.entryEquipment.equip.readerColor,
        model: comp.entryEquipment.equip.equipModel.model,
        mark: comp.entryEquipment.equip.equipModel.equipMark.mark,
        type: comp.entryEquipment.equip.equipModel.equipMark.equipType.type,
        createdAt: formatDateFunct(comp.createdAt),
        updatedAt: formatDateFunct(comp.updatedAt),
      }
      return resp
    })

    const processList = await formatData(rows)

    let show = limit
    if (process.count < show) {
      show = process.count
    }

    const response = {
      page: pageResponse,
      show,
      count: process.count,
      rows: processList,
    }
    return response
  }
}
