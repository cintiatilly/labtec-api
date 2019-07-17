const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const user = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    customized: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      // defaultValue: false,
    },
  })

  user.associate = (models) => {
    user.belongsTo(models.login)
    user.belongsTo(models.resources)
    user.belongsTo(models.typeAccount, {
      // foreignKey: {
      //   allowNull: false,
      // },
    })
  }

  return user
}
