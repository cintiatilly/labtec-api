const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const chipConnectEvent = sequelize.define('chipConnectEvent', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    average: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    state: {
      type: Sequelize.ENUM('online', 'offline', 'unknow'),
      allowNull: false,
      defaultValue: 'unknow',
    },

    date: {
      allowNull: false,
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE,
    },

  })

  return chipConnectEvent
}
