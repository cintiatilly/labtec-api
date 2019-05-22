const R = require('ramda')
const Cpf = require('@fnando/cpf/dist/node')
const Cnpj = require('@fnando/cnpj/dist/node')
const { FieldValidationError } = require('../../helpers/errors')

const validatorCpf = (cpf) => {
  if (!Cpf.isValid(cpf)) {
    throw new FieldValidationError([{ name: 'cpf', message: 'cpf is invalid' }])
  }
  return true
}

const validatorCnpj = (cnpj) => {
  if (!Cnpj.isValid(cnpj)) {
    throw new FieldValidationError([{ name: 'cnpj', message: 'cnpj is invalid' }])
  }
  return true
}

const validatorNameComplete = (name) => {
  if (!name.match(/ /)) {
    throw new FieldValidationError([{ name: 'name', message: 'need a complete name' }])
  }
  return true
}
const validatorNumChip = (numChip) => {
  if (!numChip.match(/^[0-9]+$/g)) {
    throw new FieldValidationError([{ name: 'numChip', message: 'numChip is only numbers' }])
  }
  if (numChip.length !== 10) {
    throw new FieldValidationError([{ name: 'numChip', message: 'need 10 numbers' }])
  }
  return true
}

const validatorPhoneCellOrTelphone = (phone) => {
  if (phone.length !== 11 && phone.length !== 10) {
    throw new FieldValidationError([{ name: 'phone', message: 'phone is invalid' }])
  }
  const prefix = phone.substr(2, 1)
  if (phone.length === 11 && prefix !== '9') {
    throw new FieldValidationError([{ name: 'phone', message: 'cell phone is invalid' }])
  }
  return true
}

const validatorIpUrlorNull = (value) => {
  const isNull = R.isNil(value)

  if (isNull) return true

  const isIp = value.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g)
  // eslint-disable-next-line no-useless-escape
  const isUrl = value.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g)


  if (!(isIp || isUrl || isNull)) {
    throw new FieldValidationError([{ name: 'ip', message: 'ip is invalid' }])
  }
  return true
}

module.exports = {
  validatorCpf,
  validatorCnpj,
  validatorNameComplete,
  validatorNumChip,
  validatorPhoneCellOrTelphone,
  validatorIpUrlorNull,
}
