const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    }
});

module.exports = {
    Category: mongoose.model("Category", categorySchema),
    categorySchema: categorySchema
}; 