const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
    image: String
});

module.exports = {
    Category: mongoose.model("Category", categorySchema),
    categorySchema: categorySchema
}; 