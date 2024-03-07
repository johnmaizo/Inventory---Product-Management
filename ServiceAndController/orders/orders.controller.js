const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const orderService = require("./order.service");

// Routes
router.post("/", createSchema, createOrder); // Create a new order
router.get("/", viewOrders); // View orders
router.get("/:id", getOrderById); // Get order by ID
router.put("/:id", updateSchema, updateOrder); // Update order by ID
router.get("/:id/status", getOrderStatus); // Get order status by ID

module.exports = router;

// Controller functions

// Create a new order
async function createOrder(req, res, next) {
  try {
    await orderService.createNewOrder(req.body);
    res.json({message: "Order created successfully!!"});
  } catch (error) {
    next(error);
  }
}

// View orders
async function viewOrders(req, res, next) {
  try {
    const orders = await orderService.viewOrders(req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

// Get order by ID
async function getOrderById(req, res, next) {
  const {role} = req.query;
  try {
    const order = await orderService.getOrderById(req.params.id, role);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

// Update order by ID
async function updateOrder(req, res, next) {
  const {role} = req.query;
  try {
    await orderService.updateOrder(req.params.id, req.body, role);
    res.json({message: "Order updated"});
  } catch (error) {
    next(error);
  }
}

// Get order status by ID
async function getOrderStatus(req, res, next) {
  const {role} = req.query;
  try {
    const orderStatus = await orderService.getOrderStatus(req.params.id, role);
    res.json({orderStatus});
  } catch (error) {
    next(error);
  }
}

// Request validation schemas

// Schema for creating a new order
function createSchema(req, res, next) {
  const schema = Joi.object({
    orderName: Joi.string().required(), // Name of the order
    orderQuantity: Joi.number().required(), // Quantity of the order
    orderPrice: Joi.number().required(), // Price of the order
    customerName: Joi.string().required(), // Name of the customer
    orderStatus: Joi.number().default(1), // Status of the order (default to 'Placing Order')
  });
  validateRequest(req, next, schema);
}

// Schema for updating an order
function updateSchema(req, res, next) {
  const schema = Joi.object({
    orderName: Joi.string().empty(""), // Optional: New name of the order
    customerName: Joi.string().empty(""), // Optional: New name of the customer
    orderStatus: Joi.number().valid(0, 1, 2, 3, 4, 5).empty(""), // Optional: New status of the order
  });
  validateRequest(req, next, schema);
}