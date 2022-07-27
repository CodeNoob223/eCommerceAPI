const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    street: String,
    apartment: String,
    city: String,
    zip: String,
    country: String,
    phone: Number,
    isAdmin: Boolean
});

module.exports = {
    userSchema: userSchema,
    User: mongoose.model("User", userSchema)
};