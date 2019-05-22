const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const purchaseProduct = sequelize.define('purchaseProduct', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    amount: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    pricingBuy: {
      type: Sequelize.STRING,
    },
  })

  purchaseProduct.associate = (models) => {
    purchaseProduct.belongsTo(models.productMark, {
      foreignKey: {
        allowNull: false,
      },
    })
  }

  return purchaseProduct
}
