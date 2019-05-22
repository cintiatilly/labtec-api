const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const watchModel = sequelize.define('watchModel', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    mark: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'watchMark',
    },

    model: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'watchMark',
    },
  })

  return watchModel
}
