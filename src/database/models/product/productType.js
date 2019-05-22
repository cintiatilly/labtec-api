const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const productType = sequelize.define('productType', {

    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    subcategory: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    category: {
      type: Sequelize.ENUM(
        'Equipamento',
        'Software',
        'Assesório',
        'Peça',
        'Outro',
      ),
    },
  })

  return productType
}
