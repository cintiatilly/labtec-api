const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const process = sequelize.define('process', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    status: {
      type: Sequelize.ENUM(['pre analise', 'analise', 'fabrica',
        'revisao1', 'pos analise', 'revisao 2', 'pos analise 2',
        'revisao 3', 'orçamento', 'manutenção', 'revisao final', 'estoque']),
      allowNull: false,
    },
  })


  process.associate = (models) => {
    // process.belongsTo(models.equip, {
    //   foreignKey: {
    //     allowNull: false,
    //   },
    // })
    process.hasOne(models.analyze, {
      foreignKey: {
        // allowNull: false,
      },
    })
    process.hasOne(models.entryEquipment, {
      foreignKey: {
        // allowNull: false,
      },
    })
    process.hasMany(models.time, {
      foreignKey: {
        // allowNull: false,
      },
    })
  }
  return process
}
