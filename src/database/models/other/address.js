const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const address = sequelize.define('address', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    number: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    complement: {
      type: Sequelize.STRING,
    },

    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    neighborhood: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    referencePoint: {
      type: Sequelize.STRING,
    },

    zipCode: {
      type: Sequelize.STRING,
      allowNull: false,
      set(oldValue) {
        // eslint-disable-next-line no-useless-escape
        const newValue = oldValue.replace(/\.|-/gi, '')
        this.setDataValue('zipCode', newValue)
      },
    },
  })


  return address
}
