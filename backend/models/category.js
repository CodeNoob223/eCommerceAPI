const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
    image: String
});

exports.Category = mongoose.model("Category", categorySchema); 