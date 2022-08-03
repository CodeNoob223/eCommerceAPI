const express = require("express");
const router = express.Router();
const {User} = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//get the user list
router.get("/", async (req,res) => {
    const userList = await User.find().select("-passwordHash");
    
    if (!userList) {
        return res.status(500).json({success: false});
    }

    res.send(userList);
});

//create a new user (register)
router.post("/", async (req,res) => {
    const salt = await bcrypt.genSaltSync(3);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: hashedPassword,
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

//get list of users, excluding the password
router.get("/:id", async (req,res) => {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
        req.status(500).send("The user with the given ID was not found!");
    }
    res.status(200).send(user);
});

//login user in
router.post("/login", async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    //check if user exist
    if (!user) {
        return res.status(500).send("User does not exist");
    }

    if (!req.body.password) {
        return res.status(400).send("Please type your password in");
    }

    try {
        if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = await jwt.sign(
                {
                    userId: user.id
                },
                process.env.SECRET_TOKEN,
                {
                    expiresIn: "1d"
                }
            )            

            return res.status(200).json({
                user: user.email,
                token: token
            });
        } else {
            return res.status(400).send("Password is wrong!");
        }
    } catch(err) {
        return res.status(400).send(err);
    }
})
module.exports = router;