const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const time = sequelize.define('time', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    status: {
      type: Sequelize.ENUM(['pre analise', 'analise', 'fabrica',
        'revisao1', 'pos analise', 'revisao 2', 'pos analise 2',
        'revisao 3', 'orçamento', 'manutenção', 'revisao final', 'estoque']),
      allowNull: false,
    },
    init: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  })

  return time
}
