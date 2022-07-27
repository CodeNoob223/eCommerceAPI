const {Product} = require("../models/product");
const express = require("express");
const router = express.Router();

router.post((`/`), (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    });
    newProduct.save().then((createdProduct => {
        res.status(201).json(createdProduct);
    })).catch((error) => {
        res.status(500).json({
            error: error,
            success: false
        });
    });
});

router.get((`/`), async (req, res) => {
    const productList = await Product.find(); //tim document trong collection(model) products
    try {
        res.status(200).send(productList);
    }catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;