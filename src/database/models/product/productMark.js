const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const productMark = sequelize.define('productMark', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    mark: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'productMark',
    },

    model: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'productMark',
    },

    version: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'productMark',
    },

    pricingSuggested: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  productMark.associate = (models) => {
    productMark.belongsTo(models.productType)
  }

  return productMark
}
