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
    responsibleUser: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  part.associate = (models) => {
    part.belongsToMany(models.equipModel,
      { through: 'partEquipModel' })
    // part.belongsTo(models.user, {
    //   foreignKey: {
    //     allowNull: false,
    //   },
    // })
  }

  return part
}
