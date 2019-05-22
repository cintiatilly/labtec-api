const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const stockBase = sequelize.define('stockBase', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    razaoSocial: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    stateRegistration: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'isento',
    },

    cnpj: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  })

  return stockBase
}
