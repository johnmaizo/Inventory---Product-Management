const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const productService = require("./product.service");


// Routes
router.post("/", createSchema, createProduct); // Create a new Product
router.get("/", viewProducts); // View Products
router.get("/:id", getProductById); // Get Product by ID
router.put("/:id", updateSchema, updateProduct); // Update product by ID
router.get("/:id/availability", checkStockAvailability); // Get Product by ID

// Update product by ID

module.exports = router;

// Controller functions

// Create a new order
async function createProduct(req, res, next) {
  const {role} = req.query;

  try {
    await productService.createNewProduct(req.body, role);
    res.json({message: "Product created successfully!!"});
  } catch (error) {
    next(error);
  }
}

// View orders
async function viewProducts(req, res, next) {
  try {
    const products = await productService.viewProducts(req.query);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

// Get order by ID
async function getProductById(req, res, next) {
  const {role} = req.query;
  try {
    const product = await productService.getProductById(req.params.id, role);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

// Check Stock Availability
async function checkStockAvailability(req, res, next) {
  const {role} = req.query;
  try {
    const product = await productService.checkStockAvailability(req.params.id, role);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

// Update order by ID
async function updateProduct(req, res, next) {
  const {role} = req.query;
  try {
    await productService.updateProduct(req.params.id, req.body, role);
    res.json({message: "Order updated"});
  } catch (error) {
    next(error);
  }
}

// Schema for creating a new product
function createSchema(req, res, next) {
  const schema = Joi.object({
    productName: Joi.string().required(), // Name of the product
    productPrice: Joi.number().required(), // Price of the product
    productDescription: Joi.string().required(), // Description of the product
    productStocks: Joi.number().default(0), // Stocks of the product
    isActive: Joi.boolean().default(true), // Product's status (default: true)
  });
  validateRequest(req, next, schema);
}

// Schema for updating an product
function updateSchema(req, res, next) {
  const schema = Joi.object({
    productName: Joi.string().empty(""), // Optional: New name of the product
    productPrice: Joi.number().empty(""), // Optional: New price of the product
    productDescription: Joi.string().empty(""), // Optional: New descriptin of the product
    isActive: Joi.boolean().empty(""), // Optional: Product's status
  });
  validateRequest(req, next, schema);
}
