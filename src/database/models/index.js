// others escope
const address = require('./other/address')
const contact = require('./other/contact')

// company escope
const company = require('./company')
const companyContract = require('./company/companyContract')
const companyGroup = require('./company/companyGroup')
const companyEvent = require('./company/companyEvent')
const contractClient = require('./company/contract/contractClient')
const contractItem = require('./company/contract/contractItem')
const contractServicesTypes = require('./company/contract/contractServicesTypes')

// watch escope
const watch = require('./watch')
const watchEvent = require('./watch/watchEvent')
const watchModel = require('./watch/watchModel')

// modulo escope
const chip = require('./modulo/chip')
const chipConnectEvent = require('./modulo/chip/chipConnectEvent')
const chipEvent = require('./modulo/chip/chipEvent')
const chipOut = require('./modulo/chip/chipOut')
const chipProvider = require('./modulo/chip/chipProvider')
const modulo = require('./modulo')
const moduloEvent = require('./modulo/moduloEvent')
const moduloItem = require('./modulo/moduloItem')
const moduloItemEvent = require('./modulo/moduloItem/moduloItemEvent')
const moduloItemModel = require('./modulo/moduloItem/moduloItemModel')
const moduloItemOut = require('./modulo/moduloItem/moduloItemOut')
const moduloItemType = require('./modulo/moduloItem/moduloItemType')

// product escope
const product = require('./product')
const productEvent = require('./product/productEvent')
const productMark = require('./product/productMark')
const productType = require('./product/productType')
const purchase = require('./product/purchase')
const purchaseOrder = require('./product/purchase/purchaseOrder')
const purchaseProduct = require('./product/purchase/purchaseProduct')
const purchaseSeller = require('./product/purchase/purchaseSeller')

// stock escope
const stock = require('./stock')
const stockBase = require('./stock/stockBase')
const stockLocality = require('./stock/stockLocality')
const stockLoan = require('./stock/stockLoan')
const stockLoanEvent = require('./stock/stockLoanEvent')
const stockLoanReserve = require('./stock/stockLoanReserve')


const user = require('./user')
const login = require('./user/login')
const session = require('./user/session')


module.exports = [
  // others
  address,
  contact,

  // company
  company,
  companyContract,
  companyGroup,
  companyEvent,
  contractClient,
  contractItem,
  contractServicesTypes,

  // watch
  watch,
  watchEvent,
  watchModel,

  // modulo
  chip,
  chipConnectEvent,
  chipEvent,
  chipOut,
  chipProvider,
  modulo,
  moduloEvent,
  moduloItem,
  moduloItemEvent,
  moduloItemType,
  moduloItemModel,
  moduloItemOut,

  // product
  product,
  productEvent,
  productMark,
  productType,
  purchase,
  purchaseOrder,
  purchaseProduct,
  purchaseSeller,

  // stock
  stock,
  stockBase,
  stockLocality,
  stockLoan,
  stockLoanEvent,
  stockLoanReserve,

  user,

  login,
  session,


]
