const R = require('ramda')

const CompanyDomain = require('./')

const { FieldValidationError } = require('../../helpers/errors')

const companyDomain = new CompanyDomain()

describe('companyDomain', () => {
  let companyMock = null

  beforeAll(() => {
    companyMock = {
      razaoSocial: 'teste 123 LTDA',
      cnpj: '40190041000102',
      street: 'jadaisom rodrigues',
      number: '6969',
      city: 'São Paulo',
      state: 'UF',
      neighborhood: 'JD. Avelino',
      zipCode: '03265-080',
      telphone: '(11)0965-4568',
      nameContact: 'joseildom',
      email: 'josealdo@gmasi.com',
    }
  })

  test('create', async () => {
    const companyCreated = await companyDomain.add(companyMock)

    expect(companyCreated.razaoSocial).toBe(companyMock.razaoSocial)
    expect(companyCreated.cnpj).toBe(companyMock.cnpj)
    expect(companyCreated.street).toBe(companyMock.street)
    expect(companyCreated.number).toBe(companyMock.number)
    expect(companyCreated.city).toBe(companyMock.city)
    expect(companyCreated.state).toBe(companyMock.state)
    expect(companyCreated.neighborhood).toBe(companyMock.neighborhood)
    expect(companyCreated.zipCode).toBe('03265080')
    expect(companyCreated.telphone).toBe('1109654568')
    expect(companyCreated.nameContact).toBe(companyMock.nameContact)
    expect(companyCreated.email).toBe(companyMock.email)

    await expect(companyDomain.add(companyMock))
      .rejects.toThrowError(new FieldValidationError())
  })

  test('try add company with razaoSocial null', async () => {
    const companyCreated = companyMock
    companyCreated.razaoSocial = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'razaoSocial',
        message: 'razaoSocial cannot be null',
      }]))
  })


  test('try add company without razaoSocial', async () => {
    const companyCreated = R.omit(['razaoSocial'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'razaoSocial',
        message: 'razaoSocial cannot be null',
      }]))
  })

  test('try add company with cnpj null', async () => {
    const companyCreated = companyMock
    companyCreated.cnpj = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'cnpj',
        message: 'cnpj cannot be null',
      }]))
  })


  test('try add company without cnpj', async () => {
    const companyCreated = R.omit(['cnpj'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'cnpj',
        message: 'cnpj cannot be null',
      }]))
  })

  test('try add company without cnpj invalid', async () => {
    const companyCreated = {
      ...companyMock,
      cnpj: '1234567',
    }

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'cnpj',
        message: 'cnpj or cpf is invalid',
      }]))
  })

  test('try add company with street null', async () => {
    const companyCreated = companyMock
    companyCreated.street = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'street',
        message: 'street cannot be null',
      }]))
  })


  test('try add company without street', async () => {
    const companyCreated = R.omit(['street'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'street',
        message: 'street cannot be null',
      }]))
  })

  test('try add company with email null', async () => {
    const companyCreated = companyMock
    companyCreated.email = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'email',
        message: 'email cannot be null',
      }]))
  })


  test('try add company without email', async () => {
    const companyCreated = R.omit(['email'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'email',
        message: 'email cannot be null',
      }]))
  })

  test('try add company without email invalid', async () => {
    const companyCreated = {
      ...companyMock,
      email: 'realponto@hotmail',
    }

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'email',
        message: 'email is invalid',
      }]))
  })

  test('try add company with number null', async () => {
    const companyCreated = companyMock
    companyCreated.number = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'number',
        message: 'number cannot be null',
      }]))
  })

  test('try add company without number', async () => {
    const companyCreated = R.omit(['number'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'number',
        message: 'number cannot be null',
      }]))
  })

  test('try add company without number invalid', async () => {
    const companyCreated = {
      ...companyMock,
      number: '23a23',
    }

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'number',
        message: 'number is invalid',
      }]))
  })

  test('try add company with city null', async () => {
    const companyCreated = companyMock
    companyCreated.city = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'city',
        message: 'city cannot be null',
      }]))
  })


  test('try add company without city', async () => {
    const companyCreated = R.omit(['city'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'city',
        message: 'city cannot be null',
      }]))
  })

  test('try add company with state null', async () => {
    const companyCreated = companyMock
    companyCreated.state = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'state',
        message: 'state cannot be null',
      }]))
  })


  test('try add company without state', async () => {
    const companyCreated = R.omit(['state'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'state',
        message: 'state cannot be null',
      }]))
  })

  test('try add company with neighborhood null', async () => {
    const companyCreated = companyMock
    companyCreated.neighborhood = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'neighborhood',
        message: 'neighborhood cannot be null',
      }]))
  })


  test('try add company without neighborhood', async () => {
    const companyCreated = R.omit(['neighborhood'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'neighborhood',
        message: 'neighborhood cannot be null',
      }]))
  })

  test('try add company with zipCode null', async () => {
    const companyCreated = companyMock
    companyCreated.zipCode = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'zipCode',
        message: 'zipCode cannot be null',
      }]))
  })

  test('try add company without zipCode', async () => {
    const companyCreated = R.omit(['zipCode'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'zipCode',
        message: 'zipCode cannot be null',
      }]))
  })

  test('try add company without zipCode invalid', async () => {
    const companyCreated1 = {
      ...companyMock,
      zipCode: '12354',
    }

    const companyCreated2 = {
      ...companyMock,
      zipCode: '123dfg54',
    }

    const companyCreated3 = {
      ...companyMock,
      zipCode: '123456789',
    }

    const companyCreated4 = {
      ...companyMock,
      zipCode: '12345 678',
    }

    await expect(companyDomain.add(companyCreated1)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'zipCode',
        message: 'cannot contains space',
      }]))

    await expect(companyDomain.add(companyCreated2)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'zipCode',
        message: 'zipCode is invalid',
      }]))


    await expect(companyDomain.add(companyCreated3)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'zipCode',
        message: 'zipCode is invalid',
      }]))

    await expect(companyDomain.add(companyCreated4)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'zipCode',
        message: 'cannot contains space',
      }]))
  })

  test('try add company with telphone null', async () => {
    const companyCreated = companyMock
    companyCreated.telphone = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'telphone',
        message: 'telphone cannot be null',
      }]))
  })


  test('try add company without telphone', async () => {
    const companyCreated = R.omit(['telphone'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'telphone',
        message: 'telphone cannot be null',
      }]))
  })

  test('try add company with nameContact null', async () => {
    const companyCreated = companyMock
    companyCreated.nameContact = ''

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'nameContact',
        message: 'nameContact cannot be null',
      }]))
  })


  test('try add company without nameContact', async () => {
    const companyCreated = R.omit(['nameContact'], companyMock)

    await expect(companyDomain.add(companyCreated)).rejects
      .toThrowError(new FieldValidationError([{
        field: 'nameContact',
        message: 'nameContact cannot be null',
      }]))
  })

  test('getAll', async () => {
    const companies = await companyDomain.getAll()
    expect(companies.rows.length > 0).toBeTruthy()
  })
})
