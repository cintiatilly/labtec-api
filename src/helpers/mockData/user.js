const faker = require('faker')

const generateUser = (username) => {
  const userMock = {
    name: faker.name.findName(),
    username,
    email: `${username}@test.com`,
  }
  return userMock
}

module.exports = {
  generateUser,
}
