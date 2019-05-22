const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const purchase = sequelize.define('purchase', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    danfeNfe: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    datePurchase: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
    },

    totalPrice: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    status: {
      type: Sequelize.ENUM(
        'devolution',
        'completed',
      ),
    },

  })

  purchase.associate = (models) => {
    purchase.belongsTo(models.purchaseSeller, {
      foreignKey: {
        allowNull: false,
      },
    })

    purchase.belongsTo(models.purchaseOrder, {
      foreignKey: {
        allowNull: false,
      },
    })

    purchase.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      },
    })

    purchase.hasMany(models.product)
  }

  return purchase
}
