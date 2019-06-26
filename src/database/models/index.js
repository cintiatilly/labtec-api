
const user = require('./general/user')
const login = require('./general/user/login')
const session = require('./general/user/session')
const company = require('./general/company')
const equip = require('./general/equip')
const equipType = require('./general/equip/equipType')
const equipMark = require('./general/equip/equipMark')
const equipModel = require('./general/equip/equipModel')
const typeAccount = require('./general/user/typeAccount')
const resources = require('./general/user/resources')
const entryEquipment = require('./labtec/entryEquipment')
const accessories = require('./labtec/entryEquipment/accessories')
const part = require('./labtec/part')
const analyze = require('./labtec/analyze')
const analysisPart = require('./labtec/analyze/analysisPart')
const process = require('./labtec/process')
const time = require('./labtec/process/time')

module.exports = [

  resources,
  typeAccount,
  user,
  login,
  session,

  company,

  equip,
  equipType,
  equipMark,
  equipModel,

  entryEquipment,
  accessories,

  part,
  analyze,
  analysisPart,

  process,
  time,
]
