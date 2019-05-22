const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const stockLoan = sequelize.define('stockLoan', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    status: {
      type: Sequelize.ENUM(
        'available',
        'reserved',
        'dead',
        'loan',
        'out',
        'maintenance',
      ),
    },
  })

  stockLoan.associate = (models) => {
    stockLoan.belongsTo(models.stockLocality)
    stockLoan.belongsTo(models.company)

    stockLoan.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      },
    })

    stockLoan.hasMany(models.stockLoanEvent)
  }

  return stockLoan
}
