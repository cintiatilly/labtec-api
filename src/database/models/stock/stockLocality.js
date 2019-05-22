const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const stockLocality = sequelize.define('stockLocality', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    zone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'locality',
    },

    section: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'locality',
    },

    shelf: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'locality',
    },
  })

  return stockLocality
}
