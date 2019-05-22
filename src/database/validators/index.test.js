const { FieldValidationError } = require('../../helpers/errors')
const {
  validatorCpf,
  validatorCnpj,
  validatorNameComplete,
  validatorNumChip,
  validatorIpUrlorNull,
} = require('./')


describe('validator', () => {
  describe('complete-name', () => {
    test('valid complete-name', () => {
      const testName = () => validatorNameComplete('Fulano de tal')
      expect(testName()).toBe(true)
    })

    test('invalid complete-name', () => {
      const testName = () => validatorNameComplete('Fulano')
      expect(testName).toThrowError(new FieldValidationError())
    })
  })

  describe('cpf', () => {
    test('invalid cpf', () => {
      const testcpf = () => validatorCpf('11122233355')
      expect(testcpf).toThrowError(new FieldValidationError())
    })

    test('valid cpf', () => {
      const testcpf = () => validatorCpf('53282085796')
      expect(testcpf()).toBe(true)
    })
  })

  describe('cnpj', () => {
    test('invalid cnpj case 1', () => {
      const testcnpj = () => validatorCnpj('00000000000000')
      expect(testcnpj).toThrowError(new FieldValidationError())
    })

    test('invalid cnpj case 2', () => {
      const testcnpj = () => validatorCnpj('98754563215684')
      expect(testcnpj).toThrowError(new FieldValidationError())
    })

    test('valid cnpj case 1', () => {
      const testcnpj = () => validatorCnpj('28.305.117/0001-00')
      expect(testcnpj()).toBe(true)
    })

    test('valid cnpj case 2', () => {
      const testcnpj = () => validatorCnpj('28305117000100')
      expect(testcnpj()).toBe(true)
    })
  })

  describe('numChip', () => {
    test('invalid numChip case 1', () => {
      const testnumChip = () => validatorNumChip('awda1dwad1dawd55')
      expect(testnumChip).toThrowError(new FieldValidationError())
    })

    test('invalid numChip case 2', () => {
      const testnumChip = () => validatorNumChip('dwa1.131daw.13dawd')
      expect(testnumChip).toThrowError(new FieldValidationError())
    })

    test('invalid numChip', () => {
      const testnumChip = () => validatorNumChip('1234567891411')
      expect(testnumChip).toThrowError(new FieldValidationError())
    })

    test('valid numChip', () => {
      const testnumChip = () => validatorNumChip('1234567891')
      expect(testnumChip()).toBe(true)
    })
  })

  describe('validatorIpUrlorNull', () => {
    test('invalid url', () => {
      const testurl = () => validatorIpUrlorNull('ola')
      expect(testurl).toThrowError(new FieldValidationError())
    })

    test('valid url', () => {
      const testurl = () => validatorIpUrlorNull('https://www.youtube.com')
      expect(testurl()).toBe(true)
    })

    test('invalid ip', () => {
      const testip = () => validatorIpUrlorNull('1dwadw.dwadwa.1dwad.daw1d')
      expect(testip).toThrowError(new FieldValidationError())
    })

    test('valid ip', () => {
      const testip = () => validatorIpUrlorNull('192.168.0.145')
      expect(testip()).toBe(true)
    })

    test('invalid ip', () => {
      const testnull = () => validatorIpUrlorNull('djawd')
      expect(testnull).toThrowError(new FieldValidationError())
    })

    test('valid ip', () => {
      const testnull = () => validatorIpUrlorNull(null)
      expect(testnull()).toBe(true)
    })
  })
})
