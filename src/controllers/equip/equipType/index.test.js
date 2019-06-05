const request = require('../../../helpers/request')

const EquipTypeDomain = require('../../../domains/equip/equipType')

const equipTypeDomain = new EquipTypeDomain()

describe('equipTypeController', () => {
  let equipTypeMock = null
  let equipMarkMock = null
  let headers = null
  let params = null

  beforeAll(async () => {
    equipMarkMock = {
      type: 'relogio',
      mark: 'Henry',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    equipTypeMock = {
      equipMarkId: markMock.id,
      model: 'Henry facil',
      description: '',
    }


    const loginBody = {
      username: 'modrp',
      password: '102030',
    }

    const login = await request().post('/oapi/login', loginBody)

    const { token, username } = login.body

    headers = {
      token,
      username,
    }

    params = {
      type: 'relogio',
      mark: 'Henry',
    }
  })


  test('create', async () => {
    const response = await request().post('/api/equip/equipType/addModel', equipTypeMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.equipMark.equipType.type).toBe(equipMarkMock.type)
    expect(body.equipMark.mark).toBe(equipMarkMock.mark)
    expect(body.model).toBe(equipTypeMock.model)
    expect(body.description).toBe(equipTypeMock.description)
  })

  test('create', async () => {
    equipMarkMock = {
      type: 'relogio',
      mark: 'Dell',
    }

    const response = await request().post('/api/equip/equipType/addMark', equipMarkMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.equipType.type).toBe(equipMarkMock.type)
    expect(body.mark).toBe(equipMarkMock.mark)
  })

  test('getall', async () => {
    const response = await request().get('/api/equip/equipType', { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.count).toBeTruthy()
    expect(body.page).toBeTruthy()
    expect(body.show).toBeTruthy()
    expect(body.rows).toBeTruthy()
  })

  test('getAllMarkByType', async () => {
    const response = await request().get('/api/equip/equipType/getAllMarkByType', { headers, params })

    const { statusCode } = response

    expect(statusCode).toBe(200)
  })

  test('getAllModelByMark', async () => {
    const response = await request().get('/api/equip/equipType/getAllModelByMark', { headers, params })

    const { statusCode } = response

    expect(statusCode).toBe(200)
  })
})
