const mongoose = require("mongoose");
const {userSchema} = require("./user");
const {productSchema} = require("./product");

const orderItems = new mongoose.Schema({
    product: productSchema,
    quantity: Number
});

const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    orderItems: {
        type: [orderItems],
        required: true
    },
    shippingAddress1: String,
    shippingAddress2: String,
    city: String,
    zip: String,
    country: String,
    phone: Number,
    status: String,
    localPrice: Number,
    user: userSchema,
    dateOrdered: {
        type: Date,
        default: Date.now
    }
});

exports.Order = mongoose.model("Order", orderSchema);