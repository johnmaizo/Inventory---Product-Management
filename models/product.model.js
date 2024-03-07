const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  // Define the attributes of the Product model
  const attributes = {
    productName: { type: DataTypes.STRING, allowNull: false }, // Name of the product
    productPrice: { type: DataTypes.INTEGER, allowNull: false }, // Price of the product
    productDescription: { type: DataTypes.STRING, allowNull: false }, // Description of the product
    productStocks: { type: DataTypes.INTEGER, allowNull: false }, // Quantity of the product
    isActive: { type: DataTypes.BOOLEAN, allowNull: false },
};

  // Additional options for the model
  const options = {};

  // Define and return the Product model
  return sequelize.define("Product", attributes, options);
}