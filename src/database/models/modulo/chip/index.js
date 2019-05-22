const Sequelize = require('sequelize')
const { validatorNumChip } = require('../../../validators')

module.exports = (sequelize) => {
  const chip = sequelize.define('chip', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    numChip: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumChipValid(value) { validatorNumChip(value) },
      },
    },

    ip: {
      type: Sequelize.STRING,
    },

    lot: {
      type: Sequelize.STRING,
      allowNull: false,
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

  chip.associate = (models) => {
    chip.belongsTo(models.chipProvider, {
      foreignKey: {
        allowNull: false,
      },
    })

    chip.hasMany(models.chipEvent)

    chip.hasMany(models.chipConnectEvent)
  }

  return chip
}
