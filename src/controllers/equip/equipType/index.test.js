const request = require('../../../helpers/request')

describe('equipTypeController', () => {
  let equipTypeMock = null
  let headers = null

  beforeAll(async () => {
    equipTypeMock = {
      type: 'relogio',
      mark: 'Henry',
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
  })

  test('create', async () => {
    const response = await request().post('/api/equip/equipType', equipTypeMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.equipMark.equipType.type).toBe(equipTypeMock.type)
    expect(body.equipMark.mark).toBe(equipTypeMock.mark)
    expect(body.model).toBe(equipTypeMock.model)
    expect(body.description).toBe(equipTypeMock.description)
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
})
