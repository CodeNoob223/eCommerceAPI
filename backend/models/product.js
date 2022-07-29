const mongoose = require("mongoose");
// const { categorySchema } = require("./category");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    images: {
        type: [String],
        default: []
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: {name: "none"},
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    numsReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date, 
        default: Date.now
    }
}); 

productSchema.virtual("id").get(function() {
    return this._id.toHexString();
});

productSchema.set("toJSON", {
    virtuals: true
});

// model "Product" khi len db se duoc hieu la "con/child" cua "products" nen se duoc gui vao collection "products"
module.exports = {
    productSchema: productSchema,
    Product: mongoose.model("Product", productSchema)
};