const R = require('ramda')
const moment = require('moment')

const database = require('../../database')

const { FieldValidationError } = require('../../helpers/errors')

const EntryEquipment = database.model('entryEquipment')
const Process = database.model('process')
const Time = database.model('time')


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


    const arrayStatus = ['pre analise', 'analise', 'fabrica', 'revisao1', 'pos analise', 'revisao 2',
      'pos analise 2', 'revisao 3', 'orçamento', 'manutenção', 'revisao final', 'estoque']

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

    // await Time.create(process.status, { transaction })

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

    const x = await Time.create(time, { transaction })

    // console.log(JSON.stringify(x))
    // console.log(JSON.stringify(process))

    // console.log(JSON.stringify(response))

    return response
  }
}
