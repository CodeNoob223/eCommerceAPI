const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number, 
        required: true
    },
    createDate: {
        type: Date, 
        default: Date.now
    }
}); 

// model "Product" khi len db se duoc hieu la "con/child" cua "products" nen se duoc gui vao collection "products"
module.exports = {
    productSchema: productSchema,
    Product: mongoose.model("Product", productSchema)
};