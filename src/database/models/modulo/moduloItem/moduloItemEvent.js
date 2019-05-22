const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const moduloItemEvent = sequelize.define('moduloItemEvent', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    event: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
    },

  })

  return moduloItemEvent
}
