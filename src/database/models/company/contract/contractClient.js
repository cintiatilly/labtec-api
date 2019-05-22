const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const contractClient = sequelize.define('contractClient', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    contractNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    active: {
      defaultValue: true,
      type: Sequelize.BOOLEAN,
    },

    oweMoney: {
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },

    date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
    },

    payDay: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    value: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    subsequent: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    type: {
      type: Sequelize.ENUM(
        'sale',
        'service',
      ),
    },


  })
  contractClient.associate = (models) => {
    contractClient.belongsTo(models.contractItem, {
      foreignKey: {
        allowNull: false,
        unique: true,
      },
    })
  }

  return contractClient
}
