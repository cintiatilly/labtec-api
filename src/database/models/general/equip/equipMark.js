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
    responsibleUser: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  equipMark.associate = (models) => {
    equipMark.belongsTo(models.equipType, {
      foreignKey: {
        allowNull: false,
      },
    })
  }
  return equipMark
}
