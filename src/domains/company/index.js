const R = require('ramda')
const moment = require('moment')

const Cnpj = require('@fnando/cnpj/dist/node')
const Cpf = require('@fnando/cpf/dist/node')

const formatQuery = require('../../helpers/lazyLoad')
const database = require('../../database')

const { FieldValidationError } = require('../../helpers/errors')

const Company = database.model('company')

module.exports = class CompanyDomain {
  async add(bodyData, options = {}) {
    const { transaction = null } = options

    const company = R.omit(['id'], bodyData)

    const companyNotHasProp = prop => R.not(R.has(prop, bodyData))

    if (companyNotHasProp('razaoSocial') || !company.razaoSocial) {
      throw new FieldValidationError([{
        field: 'razaoSocial',
        message: 'razaoSocial is required',
      }])
    }
    const companyReturnedRS = await Company.findOne({
      where: { razaoSocial: company.razaoSocial },
      transaction,
    })

    if (companyReturnedRS) {
      throw new FieldValidationError([{
        field: 'razaoSocial',
        message: 'razaoSocial already exists',
      }])
    }

    if (companyNotHasProp('cnpj') || !company.cnpj) {
      throw new FieldValidationError([{
        field: 'cnpj',
        message: 'cnpj is required',
      }])
    }
    const cnpjOrCpf = company.cnpj

    if (!Cnpj.isValid(cnpjOrCpf) && !Cpf.isValid(cnpjOrCpf)) {
      throw new FieldValidationError([{
        field: 'cnpj',
        message: 'cnpj or cpf is invalid',
      }])
    }

    const companyHasExist = await Company.findOne({
      where: {
        cnpj: cnpjOrCpf,
      },
      transaction,
    })

    if (companyHasExist) {
      throw new FieldValidationError([{
        field: 'cnpj',
        message: 'cnpj alread exist',
      }])
    }

    if (companyNotHasProp('street') || !company.street) {
      throw new FieldValidationError([{
        field: 'street',
        message: 'street is required',
      }])
    }

    if (companyNotHasProp('email') || !company.email) {
      throw new FieldValidationError([{
        field: 'email',
        message: 'email is required',
      }])
    }
    const { email } = bodyData

    // eslint-disable-next-line no-useless-escape
    if (!/^[\w_\-\.]+@[\w_\-\.]{2,}\.[\w]{2,}(\.[\w])?/.test(email)) {
      throw new FieldValidationError([{
        field: 'email',
        message: 'email is inválid',
      }])
    }

    if (companyNotHasProp('number') || !company.number) {
      throw new FieldValidationError([{
        field: 'number',
        message: 'number is required',
      }])
    }
    const { number } = bodyData

    if (!/^[0-9]+$/.test(number)) {
      throw new FieldValidationError([{
        field: 'number',
        message: 'number is invalid',
      }])
    }


    if (companyNotHasProp('city') || !company.city) {
      throw new FieldValidationError([{
        field: 'city',
        message: 'city is required',
      }])
    }

    if (companyNotHasProp('state') || !company.state) {
      throw new FieldValidationError([{
        field: 'state',
        message: 'state is required',
      }])
    }

    if (companyNotHasProp('neighborhood') || !company.neighborhood) {
      throw new FieldValidationError([{
        field: 'neighborhood',
        message: 'neighborhood is required',
      }])
    }

    if (companyNotHasProp('zipCode') || !company.zipCode) {
      throw new FieldValidationError([{
        field: 'zipCode',
        message: 'zipCode is required',
      }])
    }
    const { zipCode } = bodyData

    if (/^\s$/.test(zipCode)) {
      throw new FieldValidationError([{
        field: 'zipCode',
        message: 'cannot contains space',
      }])
    } else if (!/^[0-9]{8}$/.test(zipCode)) {
      throw new FieldValidationError([{
        field: 'zipCode',
        message: 'zipCode is invalid',
      }])
    }

    if (companyNotHasProp('telphone') || !company.telphone) {
      throw new FieldValidationError([{
        field: 'telphone',
        message: 'telphone is required',
      }])
    }

    if (!/^[0-9]+$/.test(company.telphone)) {
      throw new FieldValidationError([{
        field: 'telphone',
        message: 'telphone is inválid',
      }])
    }

    if (!company.telphone.length === 10 && !company.telphone.length === 11) {
      throw new FieldValidationError([{
        field: 'telphone',
        message: 'telphone is inválid',
      }])
    }

    if (companyNotHasProp('nameContact') || !company.nameContact) {
      throw new FieldValidationError([{
        field: 'nameContact',
        message: 'nameContact is required',
      }])
    }

    const companyCreated = Company.create(company, { transaction })

    return companyCreated
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

    const companies = await Company.findAndCountAll({
      where: getWhere('company'),
      order: [
        [newOrder.field, newOrder.direction],
      ],
      limit,
      offset,
      transaction,
    })

    const { rows } = companies

    const formatDateFunct = (date) => {
      moment.locale('pt-br')
      const formatDate = moment(date).format('L')
      const formatHours = moment(date).format('LT')
      const dateformated = `${formatDate} ${formatHours}`
      return dateformated
    }

    const formatTelphoneFunct = (phone) => {
      const numberOfDigits = phone.length
      let phoneFormated = phone

      if (numberOfDigits === 10) {
        phoneFormated = phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
      } else {
        phoneFormated = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
      return phoneFormated
    }

    const formetedCnpjOuCpf = (cnpjOrCpf) => {
      const numberOfDigits = cnpjOrCpf.length
      let cnpjOrCpfFormated = cnpjOrCpf

      if (numberOfDigits === 11) {
        cnpjOrCpfFormated = cnpjOrCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.-$4')
      } else {
        cnpjOrCpfFormated = cnpjOrCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      }
      return cnpjOrCpfFormated
    }

    const formatData = R.map((comp) => {
      const resp = {
        cnpj: formetedCnpjOuCpf(comp.cnpj),
        razaoSocial: comp.razaoSocial,
        createdAt: formatDateFunct(comp.createdAt),
        updatedAt: formatDateFunct(comp.updatedAt),
        nameContact: comp.nameContact,
        telphone: formatTelphoneFunct(comp.telphone),
      }
      return resp
    })

    const companiesList = formatData(rows)


    const response = {
      page: pageResponse,
      show: limit,
      count: companies.count,
      rows: companiesList,
    }
    return response
  }
}
