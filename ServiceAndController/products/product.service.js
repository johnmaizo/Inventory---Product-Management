const db = require("_helpers/db");
const {Op} = require("sequelize");
const Role = require("_helpers/role");

module.exports = {
  getAll,
  createNewProduct,
  viewProducts,
  getProductById,
  updateProduct,
  checkStockAvailability,
};

async function getAll() {
  return await db.Product.findAll();
}

async function createNewProduct(params, role) {
  authorize(role, [Role.Admin, Role.Manager]);

  const product = new db.Product(params);

  await product.save();
}

async function viewProducts({role}) {
  authorize(role, [Role.Admin, Role.Manager, Role.Customer]);

  const products = await db.Product.findAll({
    where: {
      isActive: true,
    },
    attributes: ["id", "productName"],
  });

  if (products.length === 0) {
    throw "The Product is empty. Please add new Product";
  }

  return products;
}

async function getProductById(id, role) {
  authorize(role, [Role.Admin, Role.Manager, Role.Customer]);

  // Find Product by primary key
  const product = await db.Product.findByPk(id);
  if (!product) throw "Product not found";

  if (product.isActive === true) {
    return product;
  } else {
    throw "Product is Deleted";
  }
}

async function checkStockAvailability(id, role) {
  authorize(role, [Role.Customer]);

  const product = await db.Product.findByPk(id);

  if (!product) throw "Product not found";

  if (product.isActive === true) {
    return await db.Product.findByPk(id, {
      attributes: ["productName", "productStocks"],
    });
  } else {
    throw "Product is Deleted";
  }
}

async function updateProduct(id, params, role) {
  const product = await db.Product.findByPk(id);
  if (!product) throw "Product not found";

  authorize(role, [Role.Admin, Role.Manager]);
  Object.assign(product, params);
  await product.save();
}

// Helper functions
function authorize(role, allowedRoles) {
  if (
    !role ||
    !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
  ) {
    throw "Unauthorized User";
  }
}
