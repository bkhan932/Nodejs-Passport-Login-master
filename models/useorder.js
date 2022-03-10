'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class useOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      useOrder.belongsTo(models.register, {foreignKey: 'userId'})
      useOrder.belongsTo(models.orders, {foreignKey: 'orderId'})
    }
  }
  useOrder.init({
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'useOrder',
  });
  return useOrder;
};