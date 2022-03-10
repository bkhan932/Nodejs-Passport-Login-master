'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('useOrders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {        
          model: 'registers',
          key: 'id'
        }
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {       
          model: 'orders',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('useOrders');
  }
};