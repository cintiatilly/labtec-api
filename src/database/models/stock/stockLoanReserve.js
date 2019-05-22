const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const stockLoanReserve = sequelize.define('stockLoanReserve', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  })

  stockLoanReserve.associate = (models) => {
    stockLoanReserve.belongsTo(models.stockLoan, {
      foreignKey: {
        allowNull: false,
      },
    })

    stockLoanReserve.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      },
    })

    stockLoanReserve.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      },
    })

    stockLoanReserve.hasMany(models.stockLoanEvent)
  }

  return stockLoanReserve
}
