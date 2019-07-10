const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const accessories = sequelize.define('accessories', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    accessories: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })
  return accessories
}
