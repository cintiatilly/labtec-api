const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const entryEquipment = sequelize.define('entryEquipment', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    externalDamage: {
      type: Sequelize.BOOLEAN,
    },

    details: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    defect: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    observation: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    delivery: {
      type: Sequelize.ENUM(
        'Cliente',
        'Sedex',
        'Motoboy',
        'Técnico externo',
      ),
      allowNull: false,
    },

    clientName: {
      type: Sequelize.STRING,
    },
    senderName: {
      type: Sequelize.STRING,
    },
    properlyPacked: {
      type: Sequelize.BOOLEAN,
    },
    zipCode: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    neighborhood: {
      type: Sequelize.STRING,
    },
    street: {
      type: Sequelize.STRING,
    },
    number: {
      type: Sequelize.STRING,
    },
    motoboyName: {
      type: Sequelize.STRING,
    },
    RG: {
      type: Sequelize.STRING,
    },
    Cpf: {
      type: Sequelize.STRING,
    },
    responsibleName: {
      type: Sequelize.STRING,
    },
    technicianName: {
      type: Sequelize.STRING,
    },

  })

  entryEquipment.associate = (models) => {
    entryEquipment.belongsTo(models.equip, {
      foreignKey: {
        allowNull: false,
      },
    })
    entryEquipment.hasMany(models.accessories)
  }
  return entryEquipment
}
