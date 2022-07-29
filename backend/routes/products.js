const {Product} = require("../models/product");
const {Category} = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//create a new product
router.post((`/`), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Category's ID is invalid!");

    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    const product = await newProduct.save().catch(err => {return res.send(err.message)});
    
    if (!product) {
        return res.status(500).send("The product cannot be created!");
    }

    res.status(200).send(product);
});

//get the product list
router.get((`/`), async (req, res) => {
    let filter = {};
    
    if (req.query.categories) {
        filter = {category: req.query.categories.split(",")};
    }

    const productList = await Product.find(filter); //tim document trong collection(model) products
    try {
        res.status(200).send(productList);
    }catch(err) {
        res.status(500).send(err);
    }
});

//update the product
router.put((`/:id`), async (req,res) => {
    //check for valid product's id
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid product ID");

    //check for valid category
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Category's ID is invalid!")

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        {new: true}
    ).catch(err =>  {return res.status(500).json({success: false, error: err})});

    if (!product) {
        return res.status(500).send("The product cannot be updated!");
    }

    res.status(200).send(product);
});

//delete the product
router.delete((`/:id`), (req,res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found!"});
        } else {
            return res.status(200).json({success: true, message: "Product successfully removed!"});
        }
    }).catch((err) => {
        return res.status(500).json({success: false, error: err});
    });
});

//get the ammount of existed product
router.get("/get/count", async (req, res) => {
    const productCount = await Product.countDocuments().catch(err => {
        return res.status(400).json({success: false, error: err})
    });
    if (!productCount) return res.status(500).json({success: false});

    res.status(200).json({success: true, productCount: productCount});
});

//get the featured product only
router.get("/get/featured/:limit", async(req,res) => {
    const limit = req.params.limit ? req.params.limit : 0;
    const featuredProducts = await Product.find({isFeatured: true}).limit(+limit);

    if(!featuredProducts) return res.status(500).json({success: false});

    res.status(200).send(featuredProducts);
});


module.exports = router;