const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const equipModel = sequelize.define('equipModel', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
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

  equipModel.associate = (models) => {
    equipModel.belongsTo(models.equipMark, {
      foreignKey: {
        allowNull: false,
      },
    })
  }
  return equipModel
}
