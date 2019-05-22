const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const moduloItem = sequelize.define('moduloItem', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    numSerial: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'moduloItem',
    },

    lot: {
      type: Sequelize.STRING,
    },

    status: {
      type: Sequelize.ENUM(
        'stock',
        'loanToEmployee',
        'test',
        'reserved',
        'inModule',
        'dead',
      ),
      defaultValue: 'stock',
    },
  })

  moduloItem.associate = (models) => {
    moduloItem.belongsTo(models.moduloItemType, {
      foreignKey: {
        allowNull: false,
      },
    })

    moduloItem.belongsTo(models.moduloItemModel, {
      foreignKey: {
        allowNull: false,
      },
    })

    moduloItem.hasMany(models.moduloItemEvent)
  }

  return moduloItem
}
