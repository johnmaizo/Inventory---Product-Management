const db = require("_helpers/db");
const {Op} = require("sequelize");
const Role = require("_helpers/role");

module.exports = {
  getAll,
  createNewInventory,
  viewInventory,
};

async function getAll() {
  return await db.Inventory.findAll();
}

async function createNewInventory(params, role) {
  authorize(role, [Role.Admin, Role.Manager]);

  const {productID, stockIn, stockOut} = params;

  // Find the product by ID
  const product = await db.Product.findByPk(productID);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.isActive === false) {
    throw new Error("Product is deleted");
  }

  if (stockIn && stockOut) {
    throw new Error("Select only one Stock attribute to update");
  }

  // Update product stock based on the operation
  if (stockIn) {
    product.productStocks += stockIn;
  } else if (stockOut) {
    if (product.productStocks < stockOut) {
      throw new Error("Insufficient stock");
    }
    product.productStocks -= stockOut;
  } else {
    throw new Error("Error: Please add value to the stocks");
  }

  // Save the updated product
  await product.save();

  // Create a new inventory record with the product name
  await db.Inventory.create({
    productID: product.id,
    productName: product.productName,
    stockIn: stockIn || 0,
    stockOut: stockOut || 0,
  });
}

async function viewInventory({role}) {
  authorize(role, [Role.Admin, Role.Manager]);

  const products = await db.Product.findAll({
    where: {
      isActive: true,
    },
    attributes: ["id", "productName", "productStocks"],
  });

  if (products.length === 0) {
    throw "The Inventory is empty.";
  }

  return products;
}

function authorize(role, allowedRoles) {
  if (
    !role ||
    !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
  ) {
    throw "Unauthorized User";
  }
}
