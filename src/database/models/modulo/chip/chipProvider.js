const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const chipProvider = sequelize.define('chipProvider', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    mobileProvider: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  })

  return chipProvider
}
