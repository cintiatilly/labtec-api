const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const moduloEvent = sequelize.define('moduloEvent', {
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

  return moduloEvent
}
