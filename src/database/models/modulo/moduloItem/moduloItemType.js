const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const moduloItemType = sequelize.define('moduloItemType', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    isRequired: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  })

  return moduloItemType
}
