const Sequelize = require('sequelize')
const { validatorPhoneCellOrTelphone } = require('../../validators')

module.exports = (sequelize) => {
  const contact = sequelize.define('contact', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    position: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        isPhoneValid(value) { validatorPhoneCellOrTelphone(value) },
      },
      set(oldValue) {
        // eslint-disable-next-line no-useless-escape
        const newValue = oldValue.replace(/\(|\)| |-/gi, '')
        this.setDataValue('phone', newValue)
      },
    },
  })

  return contact
}
