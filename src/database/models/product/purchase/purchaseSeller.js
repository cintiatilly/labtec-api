const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const purchaseSeller = sequelize.define('purchaseSeller', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    razaoSocial: {
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

  purchaseSeller.associate = (models) => {
    purchaseSeller.belongsTo(models.address, {
      foreignKey: {
        allowNull: false,
      },
    })

    purchaseSeller.belongsToMany(models.contact, {
      through: 'purchaseSellerContact',
    })
  }

  return purchaseSeller
}
