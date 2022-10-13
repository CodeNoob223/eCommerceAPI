const {Product} = require("../models/product");
const {Category} = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/webp": "webp"
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadStatus = new Error("Incorrect file type!");

        if (isValid) uploadStatus = null;
        cb(uploadStatus, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const extension = FILE_TYPE_MAP[file.mimetype];
        const fileName = file.originalname.replace(' ', '-');
        cb(null, `${fileName.substring(0, fileName.lastIndexOf('.'))}-${Date.now()}.${extension}`);
    }
});
  
const uploadOption = multer({ storage: storage })

//create a new product
router.post((`/`), uploadOption.single("image") ,async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Category's ID is invalid!");

    if (!req.file) return res.status(400).json({success: false, message: "There was no image in the request!"});

    const fileName = req.file.filename; //multer got us covered
    const serverPath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    //protocol is http, host is localhost
    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${serverPath}${fileName}`, //Ex: "http://localhost:3000/public/uploads/imagename-2032213"
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    newProduct = await newProduct.save().catch(err => {return res.status(500).send(err)});
    
    if (!newProduct) {
        return res.status(500).send("The product cannot be created!");
    }

    return res.status(200).send(newProduct);
});

//get the product list
router.get((`/`), async (req, res) => {
    let filter = {};
    
    if (req.query.categories) {
        filter = {category: req.query.categories.split(",")};
    }

    const productList = await Product.find(filter); //tim document trong collection(model) products
    try {
        return res.status(200).send(productList);
    }catch(err) {
        return res.status(500).send(err);
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

    return res.status(200).send(product);
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

    return res.status(200).json({success: true, productCount: productCount});
});

//get the featured product only
router.get("/get/featured/:limit", async(req,res) => {
    const limit = req.params.limit ? req.params.limit : 0;
    const featuredProducts = await Product.find({isFeatured: true}).limit(+limit);

    if(!featuredProducts) return res.status(500).json({success: false});

    return res.status(200).send(featuredProducts);
});

router.put(
    "/gallery-images/:id",
    uploadOption.array("images", 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid product ID");
        const serverPath = `${req.protocol}://${req.get("host")}/public/uploads/`;
        let imagePaths = [];
        const files = req.files;
        if (files) {
            files.map(file => {
                imagePaths.push(`${serverPath}${file.fileName}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {images: imagePaths},
            {new: true}
        ).catch(err =>  {return res.status(500).json({success: false, error: err})});
    
        if (!product) {
            return res.status(500).send("Cannot upload the images!");
        }
    
        return res.status(200).send({success: true, message: "images were uploaded!"});
    }
);


module.exports = router;