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
    type: {
      type: Sequelize.ENUM(['admin', 'tecnico', 'finac', 'recep']),
      allowNull: false,
    },
  })

  user.associate = (models) => {
    user.belongsTo(models.login)
  }

  return user
}
