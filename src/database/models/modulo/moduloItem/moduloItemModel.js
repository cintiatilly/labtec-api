const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const moduloItemModel = sequelize.define('moduloItemModel', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    mark: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'moduloItemMark',
    },

    model: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'moduloItemMark',
    },

    seller: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'moduloItemMark',
    },
  })

  return moduloItemModel
}
