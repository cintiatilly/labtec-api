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

    if (companyNotHasProp('cnpj') || !company.cnpj) {
      throw new FieldValidationError([{
        field: 'cnpj',
        message: 'cnpj is required',
      }])
    }

    if (companyNotHasProp('street') || !company.street) {
      throw new FieldValidationError([{
        field: 'street',
        message: 'street is required',
      }])
    }

    if (companyNotHasProp('number') || !company.number) {
      throw new FieldValidationError([{
        field: 'number',
        message: 'number is required',
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

    if (companyNotHasProp('telphone') || !company.telphone) {
      throw new FieldValidationError([{
        field: 'telphone',
        message: 'telphone is required',
      }])
    }

    if (companyNotHasProp('nameContact') || !company.nameContact) {
      throw new FieldValidationError([{
        field: 'nameContact',
        message: 'nameContact is required',
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

    const companyCreated = Company.create(company, { transaction })

    return companyCreated
  }

  async getAll(options = {}) {
    const inicialOrder = {
      field: 'createdAt',
      acendent: true,
      direction: 'DESC',
    }
    const { query = null, order = inicialOrder, transaction = null } = options

    if (order.acendent) {
      order.direction = 'DESC'
    } else {
      order.direction = 'ASC'
    }

    const {
      getWhere,
      limit,
      offset,
      pageResponse,
    } = formatQuery(query)

    const companies = await Company.findAndCountAll({
      where: getWhere('company'),
      order: [
        [order.field, order.direction],
      ],
      atributes: [
        'cnpj',
        'razaoSocial',
        'createdAt',
        'updatedAt',
        'nameContact',
        'telphone'],
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

    const formatData = R.forEach(comp => ({
      cnpj: comp.cnpj,
      razaoSocial: comp.razaoSocial,
      createdAt: formatDateFunct(comp.createdAt),
      updatedAt: formatDateFunct(comp.updatedAt),
      nameContact: comp.nameContact,
      telphone: comp.telphone,
    }))

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
