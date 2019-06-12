const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const part = sequelize.define('part', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    item: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    costPrice: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    salePrice: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    obsolete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  })

  part.associate = (models) => {
    part.hasMany(models.equipModel, {
    })
  }

  return part
}
