module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transacoes', 'paga', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transacoes', 'paga')
  }
}