const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const typeAccount = sequelize.define('typeAccount', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    typeName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  })


  typeAccount.associate = (models) => {
    typeAccount.hasOne(models.resources, {
      foreignKey: {
        allowNull: true,
      },
    })
  }


  return typeAccount
}
