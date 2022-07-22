const express = require("express"); 
const app = express();
const env = require("dotenv");
env.config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//create route
const api = process.env.API_URL;

app.get(`${api}/products`, async (req, res) => {
    const product = {
        id: 1,
        name: "hair dresser",
        image: "some_url"
    };
    try {
        res.send(product);
    } catch(err) {
        res.status(400).send(err);
    }
});

app.post((`${api}/products`), async (req, res) => {
    const newProduct = req.body;
    res.send(newProduct);
});

//connect to mongoDB
mongoose.connect()

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});