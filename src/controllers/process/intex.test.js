const request = require('../../helpers/request')

const database = require('../../database')

const Process = database.model('process')

describe('processcontroller', () => {
  let processMock = null
  let headers = null
  let process = null
  let bodyData = null
  let updateProcessMock = null

  beforeAll(async () => {
    processMock = {
      status: 'preAnalise',
    }

    process = await Process.create(processMock)

    updateProcessMock = {
      status: 'analise',
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

    bodyData = {
      id: process.id,
      updateProcessMock,
    }
  })

  test('update', async () => {
    const response = await request().put('/api/process/update', bodyData, { headers })

    const { body, statusCode } = response

    expect(statusCode).toBe(200)
    expect(body.status).toBe(updateProcessMock.status)
  })
})
