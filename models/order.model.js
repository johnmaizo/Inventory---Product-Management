const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  // Define the attributes of the Order model
  const attributes = {
    orderName: { type: DataTypes.STRING, allowNull: false }, // Name of the Order
    orderQuantity: { type: DataTypes.INTEGER, allowNull: false }, // Quantity of the Order
    orderPrice: { type: DataTypes.INTEGER, allowNull: false }, // Price of the Order
    customerName: { type: DataTypes.STRING, allowNull: false }, // Name of the customer who placed the order
    orderStatus: { type: DataTypes.INTEGER, allowNull: false }, // Status of the order
  };

  // Additional options for the model
  const options = {};

  // Define and return the Order model
  return sequelize.define("Order", attributes, options);
}