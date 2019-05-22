const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const stock = sequelize.define('stock', {
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
        'sold',
        'out',
        'internal',
      ),
    },
  })

  stock.associate = (models) => {
    stock.belongsTo(models.stockBase, {
      foreignKey: {
        allowNull: false,
      },
    })

    stock.belongsTo(models.stockLocality, {
      foreignKey: {
        allowNull: false,
      },
    })

    stock.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      },
    })
  }

  return stock
}
