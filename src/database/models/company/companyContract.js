const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const companyContract = sequelize.define('companyContract', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

  })
  companyContract.associate = (models) => {
    companyContract.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      },
    })

    companyContract.belongsTo(models.contractClient, {
      foreignKey: {
        allowNull: false,
      },
    })
  }

  return companyContract
}
