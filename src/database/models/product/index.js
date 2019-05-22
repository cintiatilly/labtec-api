const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const product = sequelize.define('product', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    serialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    internalSerialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  })

  product.associate = (models) => {
    product.belongsTo(models.productMark, {
      foreignKey: {
        allowNull: false,
      },
    })

    product.hasMany(models.productEvent)
  }

  return product
}
