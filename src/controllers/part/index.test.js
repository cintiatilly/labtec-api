const request = require('../../helpers/request')

const EquipTypeDomain = require('../../domains/equip/equipType')
const PartDomain = require('../../domains/part')

const equipTypeDomain = new EquipTypeDomain()
const partDomain = new PartDomain()

describe('partController', () => {
  let partMock = null
  let equipModelMock = null
  let equipMarkMock = null
  let headers = null
  let bodyData = null
  let params = null

  beforeAll(async () => {
    equipMarkMock = {
      type: 'catraca',
      mark: 'Lakai',
    }

    const markMock = await equipTypeDomain.addMark(equipMarkMock)

    equipModelMock = {
      equipMarkId: markMock.id,
      model: 'Lakai 2.0',
      description: '',
    }

    const modelMock = await equipTypeDomain.addModel(equipModelMock)

    partMock = {
      item: 'teclado',
      description: '',
      costPrice: '100,00',
      salePrice: '150,00',
      equipModels: [{ id: modelMock.id }],
    }

    const partCreated = await partDomain.add(partMock)


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

    bodyData = {
      partId: partCreated.id,
      newCostPrince: '500,00',
      newSalePrice: '550,00',
    }

    params = {
      query: {
        filters: {
          company: {
            global: {
              fields: [
                'item',
              ],
              value: '',
            },
            specific: {
              item: '',
            },
          },
        },
        page: 1,
        total: 25,
        order: {
          field: 'createdAt',
          acendent: true,
        },
      },
    }
  })

  test('create', async () => {
    const response = await request().post('/api/part', partMock, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.item).toBe(partMock.item)
    expect(body.description).toBe(partMock.description)
    expect(body.costPrice).toBe('10000')
    expect(body.salePrice).toBe('15000')
  })

  test('updateByCostPrince', async () => {
    const response = await request().put('/api/part/updateByCostPrince', bodyData, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.item).toBe(partMock.item)
    expect(body.description).toBe(partMock.description)
    expect(body.costPrice).toBe('50000')
    expect(body.salePrice).toBe('15000')
  })

  test('updateBySalePrice', async () => {
    const response = await request().put('/api/part/updateBySalePrice', bodyData, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.item).toBe(partMock.item)
    expect(body.description).toBe(partMock.description)
    expect(body.costPrice).toBe('50000')
    expect(body.salePrice).toBe('55000')
  })

  test('getAllParts', async () => {
    const response = await request().get('/api/part', { headers, params })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.count).toBeTruthy()
    expect(body.page).toBeTruthy()
    expect(body.show).toBeTruthy()
    expect(body.rows).toBeTruthy()
  })
})
