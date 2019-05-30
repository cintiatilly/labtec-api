
const user = require('./user')
const login = require('./user/login')
const session = require('./user/session')
const company = require('./company')
const equip = require('./equip')
const equipType = require('./equipType')
const equipMark = require('./equipMark')


module.exports = [

  user,
  login,
  session,

  company,
  equip,

  equipType,
  equipMark,
]
