
const database = require('../../database')
const ProcessDomain = require('../process')


const processDomain = new ProcessDomain()

const Process = database.model('process')

describe('ProcessDomain', () => {
  let processMock = null
  let process = null
  let updateProcessMock = null

  beforeAll(async () => {
    processMock = {
      status: 'preAnalise',
    }

    process = await Process.create(processMock)

    updateProcessMock = {
      status: 'analise',
    }
  })

  test('create', async () => {
    const updateProcess = await processDomain.update(process.id, updateProcessMock)

    expect(updateProcess).toBeTruthy()
  })
})
