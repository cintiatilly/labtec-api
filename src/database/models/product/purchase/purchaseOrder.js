const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const purchaseOrder = sequelize.define('purchaseOrder', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    dateOrder: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
    },

    status: {
      type: Sequelize.ENUM(
        'awaiting_purchase',
        'cancelled',
        'bought',
      ),
    },
  })

  purchaseOrder.associate = (models) => {
    purchaseOrder.belongsTo(models.user, {
      foreignKey: {
        name: 'requesterId',
        allowNull: false,
      },
    })

    purchaseOrder.belongsTo(models.stockBase, {
      foreignKey: {
        allowNull: false,
      },
    })

    purchaseOrder.hasMany(models.purchaseProduct)
  }

  return purchaseOrder
}
