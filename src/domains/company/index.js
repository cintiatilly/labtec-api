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

    const errors = []

    if (companyNotHasProp('razaoSocial') || !company.razaoSocial) {
      errors.push({
        field: 'razaoSocial',
        message: 'O campo Razão social é obrigatório',
      })
    } else {
      const companyReturnedRS = await Company.findOne({
        where: { razaoSocial: company.razaoSocial },
        transaction,
      })

      if (companyReturnedRS) {
        errors.push({
          field: 'razaoSocial',
          message: 'Razâo social já extiste',
        })
      }
    }

    if (companyNotHasProp('cnpj') || !company.cnpj) {
      errors.push({
        field: 'cnpj',
        message: 'O campo cnpj é obrigatório',
      })
    } else {
      const cnpjOrCpf = company.cnpj

      if (!Cnpj.isValid(cnpjOrCpf) && !Cpf.isValid(cnpjOrCpf)) {
        errors.push({
          field: 'cnpj',
          message: 'cnpj ou cpf inválido',
        })
      }

      const companyHasExist = await Company.findOne({
        where: {
          cnpj: cnpjOrCpf,
        },
        transaction,
      })

      if (companyHasExist) {
        errors.push({
          field: 'cnpj',
          message: 'cnpj já exixte',
        })
      }
    }

    if (companyNotHasProp('street') || !company.street) {
      errors.push({
        field: 'street',
        message: 'O campo rua é obrigatório',
      })
    }

    if (companyNotHasProp('email') || !company.email) {
      errors.push({
        field: 'email',
        message: 'O campo E-mail é obrigatório',
      })
    } else {
      const { email } = bodyData

      // eslint-disable-next-line no-useless-escape
      if (!/^[\w_\-\.]+@[\w_\-\.]{2,}\.[\w]{2,}(\.[\w])?/.test(email)) {
        errors.push({
          field: 'email',
          message: 'E-mail inválido',
        })
      }
    }


    if (companyNotHasProp('number') || !company.number) {
      errors.push({
        field: 'number',
        message: 'O campo Número é obrigatório',
      })
    } else {
      const { number } = bodyData

      if (!/^[0-9]+$/.test(number)) {
        errors.push({
          field: 'number',
          message: 'Número inválido',
        })
      }
    }


    if (companyNotHasProp('city') || !company.city) {
      errors.push({
        field: 'city',
        message: 'O campo Cidade é obrigatório',
      })
    }

    if (companyNotHasProp('state') || !company.state) {
      errors.push({
        field: 'state',
        message: 'O campo Estado é obrigatório',
      })
    }

    if (companyNotHasProp('neighborhood') || !company.neighborhood) {
      errors.push({
        field: 'neighborhood',
        message: 'O campo Bairro é obrigatório',
      })
    }

    if (companyNotHasProp('zipCode') || !company.zipCode) {
      errors.push({
        field: 'zipCode',
        message: 'O campo CEP é obrigatório',
      })
    } else {
      const { zipCode } = company
      company.zipCode = zipCode.replace(/-/, '')

      if (!/^\d{8}$/.test(company.zipCode)) {
        errors.push({
          field: 'zipCode',
          message: 'CEP inválido',
        })
      }
    }


    if (companyNotHasProp('telphone') || !company.telphone) {
      errors.push({
        field: 'telphone',
        message: 'O campo Telefone é obrigatório',
      })
    } else {
      const { telphone } = company
      company.telphone = telphone.replace(/\(*\)*-*/g, '')

      if (!/^\d+$/.test(company.telphone)) {
        errors.push({
          field: 'telphone',
          message: 'Telefone inválido',
        })
      }

      if (!company.telphone.length === 10 && !company.telphone.length === 11) {
        errors.push({
          field: 'telphone',
          message: 'Telefone inválido',
        })
      }
    }


    if (companyNotHasProp('nameContact') || !company.nameContact) {
      errors.push({
        field: 'nameContact',
        message: 'O compo Nome para contato é obrigatório',
      })
    }

    if (errors.length) {
      throw new FieldValidationError(errors)
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
