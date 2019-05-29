const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const equip = sequelize.define('equip', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    serialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    readerColor: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    details: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })

  equip.associate = (models) => {
    equip.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      },
    })
    equip.belongsTo(models.equipType, {
      foreignKey: {
        allowNull: false,
      },
    })
  }

  return equip
}
