
const user = require('./user')
const login = require('./user/login')
const session = require('./user/session')
const company = require('./company')
const equip = require('./equip')
const equipType = require('./equip/equipType')
const equipMark = require('./equip/equipMark')
const equipModel = require('./equip/equipModel')
const entryEquipment = require('./entryEquipment')
const accessories = require('./entryEquipment/accessories')

module.exports = [

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
]
