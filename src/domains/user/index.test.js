const R = require('ramda')

const database = require('../../database')

const UserDomain = require('./')

const Login = database.model('login')
const User = database.model('user')

const { FieldValidationError } = require('../../helpers/errors')
const { generateUser } = require('../../helpers/mockData/user')

const userDomain = new UserDomain()

describe('user-domain', () => {
  describe('create user', () => {
    test('correct data', async () => {
      const userMock = generateUser('create_user_domain')

      const userCreated = await userDomain.user_Create(userMock)

      expect(userCreated.username).toEqual(userMock.username)
      expect(userCreated.email).toEqual(userMock.email)

      expect(userCreated).not.toHaveProperty('login')
      expect(userCreated).not.toHaveProperty('password')
    })

    test('omit username', async () => {
      const userMock = R.omit(['username'], generateUser('create_user_domain'))

      await expect(userDomain.user_Create(userMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'username',
          message: 'username cannot be null',
        }]))
    })
  })

  describe('update password', () => {
    let userMockGenerated = {}
    let counter = 1
    let userCreated = {}

    beforeEach(async () => {
      userMockGenerated = generateUser(`updatepassword_user_domain_${counter.toString()}`)
      counter += 1
      userCreated = await userDomain.user_Create(userMockGenerated)
    })

    test('update password', async () => {
      const login = await Login.findOne({
        include: [{
          model: User,
          where: { username: userCreated.username },
        }],
      })

      const checkPwd1 = await login.checkPassword(userCreated.username)
      const checkPwd2 = await login.checkPassword('senha')

      expect(checkPwd1).toBeTruthy()
      expect(checkPwd2).toBeFalsy()

      const body = {
        username: userCreated.username,
        oldPassword: userCreated.username,
        newPassword: 'senha',
      }

      await userDomain.user_PasswordUpdate(body)

      const login2 = await Login.findOne({
        include: [{
          model: User,
          where: { username: userCreated.username },
        }],
      })

      const checkPwd3 = await login2.checkPassword(userCreated.username)
      const checkPwd4 = await login2.checkPassword('senha')

      expect(checkPwd4).toBeTruthy()
      expect(checkPwd3).toBeFalsy()
    })
  })

  describe('update user', () => {
    let userCreated = {}
    let counter = 1

    beforeEach(async () => {
      const userMock = generateUser(`update_user_domain_${counter.toString()}`)
      counter += 1
      userCreated = await userDomain.user_Create(userMock)
    })

    test('update name by id', async () => {
      const userMock = R.omit(['id', 'email', 'username'], userCreated)
      userMock.name = 'guiga lherme'

      const userUpdate = await userDomain.user_UpdateById(userCreated.id, userMock)

      expect(userUpdate.name).toEqual(userMock.name)
      expect(userUpdate.email).toEqual(userCreated.email)
      expect(userUpdate.username).toEqual(userCreated.username)
    })

    test('update email by id', async () => {
      const userMock = R.omit(['id', 'name', 'username'], userCreated)
      userMock.email = 'lindo@gmail.com'

      const userUpdate = await userDomain.user_UpdateById(userCreated.id, userMock)

      expect(userUpdate.name).toEqual(userCreated.name)
      expect(userUpdate.email).toEqual(userMock.email)
      expect(userUpdate.username).toEqual(userCreated.username)
    })

    test('update name and email by id', async () => {
      const userMock = R.omit(['id', 'username'], userCreated)
      userMock.email = 'lindaobonitoegostosao@gmail.com'
      userMock.name = 'lindo'

      const userUpdate = await userDomain.user_UpdateById(userCreated.id, userMock)

      expect(userUpdate.name).toEqual(userMock.name)
      expect(userUpdate.email).toEqual(userMock.email)
      expect(userUpdate.username).toEqual(userCreated.username)
    })
  })

  describe('checkPassword', () => {
    let userCreated = {}
    let counter = 1

    beforeEach(async () => {
      const userMock = generateUser(`checkpasssword_user_domain_${counter.toString()}`)
      counter += 1
      userCreated = await userDomain.user_Create(userMock)
    })

    test('checkPassword', async () => {
      // eslint-disable-next-line max-len
      const checkPwdValid = await userDomain.user_CheckPassword(userCreated.id, userCreated.username)
      const checkPwdInvalid = await userDomain.user_CheckPassword(userCreated.id, '13132')

      expect(checkPwdValid).toBeTruthy()
      expect(checkPwdInvalid).toBeFalsy()
    })
  })
})
