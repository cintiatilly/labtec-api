const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const contractServicesTypes = sequelize.define('contractServicesTypes', {

    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    subcategory: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    pricingSuggested: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  return contractServicesTypes
}
