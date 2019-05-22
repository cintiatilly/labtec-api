const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const productEvent = sequelize.define('productEvent', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    event: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    idEvent: {
      type: Sequelize.UUID,
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
    },

  })

  return productEvent
}
