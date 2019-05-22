const faker = require('faker')

const generateAddress = () => {
  const numberMock = (range = {
    min: 1,
    max: 3999,
  }) => faker.random.number(range)

  const addressMock = {
    street: `${faker.name.findName()} ${faker.name.findName()}`,
    number: String(numberMock()),
    complement: 'complement',
    city: 'São Bernardo do Campo',
    state: 'SP',
    neighborhood: 'Jd Planalto',
    referencePoint: 'Próximo a avenida piraporinha',
    zipCode: '06556090',
  }
  return addressMock
}

module.exports = {
  generateAddress,
}
