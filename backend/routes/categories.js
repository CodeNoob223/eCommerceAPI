const express = require("express");
const category = require("../models/category");
const router = express.Router();
const {Category} = require("../models/category");


//get all the categories
router.get("/", async (req,res) => {
    const categoryList = await Category.find();
    
    if (!categoryList) {
        return res.status(500).json({success: false});
    }

    res.send(categoryList);
});

//get one category
router.get("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        return res.status(500).json({message: "The category with the give ID was not found!"});
    }

    res.status(200).send(category);
});

//create a new category
router.post("/", async (req, res) => {
    let newCategory = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image
    });
    newCategory = await newCategory.save();

    if(!newCategory) {
        return res.status(404).send("The category can't be created!");
    }

    res.status(200).send(newCategory);
});

//remove a category
router.delete("/:id", async(req,res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category) {
            return res.status(200).json({success: true, message: "The category is removed!"});
        } else {
            return res.status(404).json({success: false, message: "The category is not found!"});
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err});
    })
});

//update a category
router.put("/:id", async (req,res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon, 
            image: req.body.image 
        },
        {new: true}
    );

    if (!category) {
        return res.status(404).send("The category is not found!");
    }

    res.status(200).send(category);
});

module.exports = router;