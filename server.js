require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


// Api Routes
app.use("/orders", require("./ServiceAndController/orders/orders.controller"));
app.use("/products", require("./ServiceAndController/products/products.controller"));
app.use("/inventory", require("./ServiceAndController/inventories/inventories.controller"));

// Global Error Handler
app.use(errorHandler);

// Start Server
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log("Server listening on port " + port));