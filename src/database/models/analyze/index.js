const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const analyze = sequelize.define('analyze', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    status: {
      type: Sequelize.ENUM(['recusado', 'aprovado', 'aguardando aprovação']),
      allowNull: false,
      defaultValue: 'aguardando aprovação',
    },

    humidity: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    fall: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    misuse: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    brokenSeal: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    factory: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  })

  analyze.associate = (models) => {
    analyze.hasMany(models.analysisPart, {
      foreignKey: {
        // allowNull: false,
      },
    })
  }

  return analyze
}
