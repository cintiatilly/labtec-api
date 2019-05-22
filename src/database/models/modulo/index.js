const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const modulo = sequelize.define('modulo', {
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

  })

  modulo.associate = (models) => {
    modulo.hasOne(models.chip, {
      // foreignKey: {
      //   allowNull: false,
      // },
    })

    modulo.hasMany(models.watch, {
      foreignKey: {
        allowNull: false,
      },
    })

    modulo.hasMany(models.moduloItem, {
      foreignKey: {
        allowNull: false,
      },
    })

    modulo.hasMany(models.moduloEvent)
  }


  return modulo
}
