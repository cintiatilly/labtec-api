const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const watch = sequelize.define('watch', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    serialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    contractNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    cnpj: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

  })

  watch.associate = (models) => {
    watch.belongsTo(models.watchModel, {
      foreignKey: {
        allowNull: false,
      },
    })

    watch.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      },
    })

    watch.hasMany(models.watchEvent)
  }


  return watch
}
