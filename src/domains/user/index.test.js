const UserDomain = require('./')
const TypeAccount = require('./typeAccount')

const userDomain = new UserDomain()
const typeAccount = new TypeAccount()


describe('create user', () => {

  let typeAccountMock = null

  beforeAll(async () => {
    typeAccountMock = {
      typeName: 'TECNICO',
      addCompany: true,
      addPart: true,
      addAnalyze: true,
      addEquip: false,
      addEntry: false,
    }
  })

  test('', async () => {
    const typeAccountCreate = await typeAccount.add(typeAccountMock)

    const userMock = {
      username: 'teste1',
      typeAccountId: typeAccountCreate.id,
    }
    const userCreated = await userDomain.user_Create(userMock)

    expect(userCreated.username).toEqual(userMock.username)
    expect(userCreated.type).toEqual(userMock.type)

    expect(userCreated).not.toHaveProperty('login')
    expect(userCreated).not.toHaveProperty('password')
  })
})

  // describe('update password', () => {
  //   let userMockGenerated = {}
  //   let counter = 1
  //   let userCreated = {}

  //   beforeEach(async () => {
  //     userMockGenerated = generateUser(`updatepassword_user_domain_${counter.toString()}`)
  //     counter += 1
  //     userCreated = await userDomain.user_Create(userMockGenerated)
  //   })

  //   test('update password', async () => {
  //     const login = await Login.findOne({
  //       include: [{
  //         model: User,
  //         where: { username: userCreated.username },
  //       }],
  //     })

  //     const checkPwd1 = await login.checkPassword(userCreated.username)
  //     const checkPwd2 = await login.checkPassword('senha')

  //     expect(checkPwd1).toBeTruthy()
  //     expect(checkPwd2).toBeFalsy()

  //     const body = {
  //       username: userCreated.username,
  //       oldPassword: userCreated.username,
  //       newPassword: 'senha',
  //     }

  //     await userDomain.user_PasswordUpdate(body)

  //     const login2 = await Login.findOne({
  //       include: [{
  //         model: User,
  //         where: { username: userCreated.username },
  //       }],
  //     })

  //     const checkPwd3 = await login2.checkPassword(userCreated.username)
  //     const checkPwd4 = await login2.checkPassword('senha')

  //     expect(checkPwd4).toBeTruthy()
  //     expect(checkPwd3).toBeFalsy()
  //   })
  // })

//   describe('update user', () => {
//     let userCreated = {}
//     let counter = 1

//     beforeEach(async () => {
//       const userMock = generateUser(`update_user_domain_${counter.toString()}`)
//       counter += 1
//       userCreated = await userDomain.user_Create(userMock)
//     })

//     test('update name by id', async () => {
//       const userMock = R.omit(['id', 'email', 'username'], userCreated)
//       userMock.name = 'guiga lherme'

//       const userUpdate = await userDomain.user_UpdateById(userCreated.id, userMock)

//       expect(userUpdate.name).toEqual(userMock.name)
//       expect(userUpdate.email).toEqual(userCreated.email)
//       expect(userUpdate.username).toEqual(userCreated.username)
//     })

//     test('update email by id', async () => {
//       const userMock = R.omit(['id', 'name', 'username'], userCreated)
//       userMock.email = 'lindo@gmail.com'

//       const userUpdate = await userDomain.user_UpdateById(userCreated.id, userMock)

//       expect(userUpdate.name).toEqual(userCreated.name)
//       expect(userUpdate.email).toEqual(userMock.email)
//       expect(userUpdate.username).toEqual(userCreated.username)
//     })

//     test('update name and email by id', async () => {
//       const userMock = R.omit(['id', 'username'], userCreated)
//       userMock.email = 'lindaobonitoegostosao@gmail.com'
//       userMock.name = 'lindo'

//       const userUpdate = await userDomain.user_UpdateById(userCreated.id, userMock)

//       expect(userUpdate.name).toEqual(userMock.name)
//       expect(userUpdate.email).toEqual(userMock.email)
//       expect(userUpdate.username).toEqual(userCreated.username)
//     })
//   })

//   describe('checkPassword', () => {
//     let userCreated = {}
//     let counter = 1

//     beforeEach(async () => {
//       const userMock = generateUser(`checkpasssword_user_domain_${counter.toString()}`)
//       counter += 1
//       userCreated = await userDomain.user_Create(userMock)
//     })

//     test('checkPassword', async () => {
//       // eslint-disable-next-line max-len
//       const checkPwdValid = await userDomain.user_C
// heckPassword(userCreated.id, userCreated.username)
//       const checkPwdInvalid = await userDomain.user_CheckPassword(userCreated.id, '13132')

//       expect(checkPwdValid).toBeTruthy()
//       expect(checkPwdInvalid).toBeFalsy()
//     })
//   })
// })
