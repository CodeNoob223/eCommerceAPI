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

//Routes
const api = process.env.API_URL;
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const usersRoute = require("./routes/users");
const categoriesRoute = require("./routes/categories");

app.use(`${api}/products`, productsRoute);
app.use(`${api}/orders`, ordersRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/categories`, categoriesRoute);


//connect to mongoDB
mongoose.connect(process.env.CONNECT_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'eshop-database'
    }
)
.then(() => {
    console.log("Connected to the database!");
}).catch((err) => console.log(err));

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});