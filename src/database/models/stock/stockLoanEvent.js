const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const stockLoanEvent = sequelize.define('stockLoanEvent', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
    },

  })

  return stockLoanEvent
}
