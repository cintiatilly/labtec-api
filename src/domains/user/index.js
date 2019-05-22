const R = require('ramda')

const { FieldValidationError, UnauthorizedError } = require('../../helpers/errors')

const database = require('../../database')

const User = database.model('user')
const Login = database.model('login')

class UserDomain {
  // eslint-disable-next-line camelcase
  async user_Create(bodyData, options = {}) {
    const userNotFormatted = R.omit(['id', 'password'], bodyData)

    const noHasUsername = R.not(R.has('username', userNotFormatted))

    if (noHasUsername) {
      throw new FieldValidationError([{
        field: 'username',
        message: 'username cannot be null',
      }])
    }

    const formatBody = R.evolve({
      username: R.pipe(
        R.toLower(),
        R.trim(),
      ),
    })

    const user = formatBody(userNotFormatted)

    const password = R.prop('username', user)

    const { transaction = null } = options

    const userFormatted = {
      ...user,
      login: {
        password,
      },
    }

    const optionsForCreate = {
      include: [Login],
      transaction,
    }
    const userCreated = await User.create(userFormatted, optionsForCreate)

    const userReturned = await User.findByPk(userCreated.id, {
      attributes: { exclude: ['loginId'] },
    })

    return userReturned
  }

  // eslint-disable-next-line camelcase
  async user_PasswordUpdate(bodyData, options = {}) {
    const { transaction = null } = options

    const hasUsername = R.has('username', bodyData)

    const hasOldPassword = R.has('oldPassword', bodyData)

    const hasNewPassword = R.has('newPassword', bodyData)

    if (!hasUsername || !bodyData.username) {
      throw new FieldValidationError([{
        name: 'username',
        message: 'username cannot to be null',
      }])
    }

    if (!hasOldPassword || !bodyData.oldPassword) {
      throw new FieldValidationError([{
        name: 'oldPassword',
        message: 'oldPassword cannot to be null',
      }])
    }

    if (!hasNewPassword || !bodyData.newPassword) {
      throw new FieldValidationError([{
        name: 'newPassword',
        message: 'newPassword cannot to be null',
      }])
    }

    const getBody = R.applySpec({
      username: R.prop('username'),
      oldPassword: R.prop('oldPassword'),
      newPassword: R.prop('newPassword'),
    })

    const body = getBody(bodyData)

    const login = await Login.findOne({
      include: [{
        model: User,
        where: { username: body.username },
      }],
      transaction,
    })

    if (!login) {
      throw new UnauthorizedError()
    }

    const checkPwd = await login.checkPassword(body.oldPassword)

    if (!checkPwd) {
      throw new UnauthorizedError()
    }

    if (checkPwd) {
      await login.update({
        password: body.newPassword,
      })
      const loginUpdated = await Login.findOne({
        include: [{
          model: User,
          where: { username: body.username },
        }],
        transaction,
      })
      return loginUpdated
    }
    throw new UnauthorizedError()
  }

  // eslint-disable-next-line camelcase
  async user_UpdateById(id, bodyData, options = {}) {
    const { transaction = null } = options

    let newUser = {}

    const user = R.omit(['id', 'username'], bodyData)

    const hasName = R.has('name', user)

    const hasEmail = R.has('email', user)

    if (hasEmail) {
      newUser = {
        ...newUser,
        email: R.prop('email', user),
      }

      if (!user.email) {
        throw new FieldValidationError([{
          name: 'email',
          message: 'email cannot be null',
        }])
      }

      const email = await User.findOne({
        where: {
          email: user.email,
        },
        transaction,
      })

      if (email) {
        throw new FieldValidationError([{
          field: 'email',
          message: 'email already exist',
        }])
      }
    }

    if (hasName) {
      newUser = {
        ...newUser,
        name: R.prop('name', user),
      }

      if (!user.name) {
        throw new FieldValidationError([{
          name: 'name',
          message: 'name cannot be null',
        }])
      }
    }

    const userInstance = await User.findByPk(id, {
      transaction,
    })

    await userInstance.update(newUser)

    const userUpdated = await User.findByPk(id, {
      transaction,
    })

    return userUpdated
  }

  // eslint-disable-next-line camelcase
  async user_CheckPassword(id, password, options = {}) {
    const { transaction = null } = options

    const login = await Login.findOne({
      include: [{
        model: User,
        where: { id },
      }],
      transaction,
    })

    if (!login) {
      throw new UnauthorizedError()
    }

    return login.checkPassword(password)
  }
}

module.exports = UserDomain
