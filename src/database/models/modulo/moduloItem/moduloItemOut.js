const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const moduloItemOut = sequelize.define('moduloItemOut', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    employeeName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    employeeId: {
      type: Sequelize.STRING,
    },

    autorizationName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    autorizationId: {
      type: Sequelize.STRING,
    },

    dateLoan: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    dateReturned: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  })

  moduloItemOut.associate = (models) => {
    moduloItemOut.belongsTo(models.moduloItem, {
      foreignKey: {
        allowNull: false,
      },
    })
  }

  return moduloItemOut
}
