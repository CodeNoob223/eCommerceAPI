const express = require("express");
const router = express.Router();
const {User} = require("../models/user");

//get the user list
router.get("/", async (req,res) => {
    const userList = await User.find();
    
    if (!userList) {
        return res.status(500).json({success: false});
    }

    res.send(userList);
});

//create a new user
router.post("/", async (req,res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country
    });

    newUser = await newUser.save().catch(err => {return res.status(400).send(err)});

    if(!newUser) {
        return res.status(500).json({success: false});
    }

    res.status(200).send(newUser);
});

module.exports = router;