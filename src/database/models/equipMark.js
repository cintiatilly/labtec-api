const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const equipMark = sequelize.define('equipMark', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    mark: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    model: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })
  return equipMark
}
