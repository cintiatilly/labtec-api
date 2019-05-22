
const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const contractItem = sequelize.define('contractItem', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    pricing: {
      type: Sequelize.STRING,
      allowNull: false,
    },

  })
  contractItem.associate = (models) => {
    contractItem.belongsTo(models.contractServicesTypes, {
      foreignKey: {
        allowNull: false,
      },
    })

    contractItem.belongsTo(models.product)
    contractItem.belongsTo(models.company)
  }

  return contractItem
}
