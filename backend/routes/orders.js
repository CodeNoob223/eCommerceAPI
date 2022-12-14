const express = require("express");
const router = express.Router();
const {Order} = require("../models/order");
const {OrderItem} = require("../models/order-item");

//get list of orders
router.get("/", async (req,res) => {
    const orderList = await Order.find()
    .populate(
        {
            path: "user", 
            select: "name"
        }
    )
    .sort("dateOdered");
    if (!orderList) {
        return res.status(500).json({success: false});
    }

    res.send(orderList);
});

//get a specific order and populate the ids
router.get("/:id", async(req, res) => {
    const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
        path: "orderItems",
        populate: {
            path: "product",
            select: ["name", "price", "category"],
            populate: {
                path: "category",
                select: ["name", "color"]
            }
        }
    })
    .catch(err => {
        return res.status(500).json({success: false, error: err});
    })

    if (!order) {
        return res.status(400).json({success: false});
    }

    return res.status(200).send(order);
})

//count existed orders
router.get("/get/count", async (req, res) => {
    const ordersCount = await Order.countDocuments().catch(err => {
        return res.status(500).json({success: false, error: err});
    });

    if (!ordersCount) {
        return res.status(500).json({success: false});
    }

    return res.status(200).json({ordersCount: ordersCount});

});

//create an order
router.post("/", async(req, res) => {
    const orderItemsIds = await Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));

    const totalPrices = await Promise.all(orderItemsIds.map(
        async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
         
            return totalPrice;
        }
    )); 
    
    const totalPrice = totalPrices.reduce((prevVal,nextVal) => prevVal + nextVal, 0);

    let newOrder = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user
    });

    newOrder = await newOrder.save().catch(err => {return res.status(500).send(err)});
    
    if (!newOrder) {
        return res.status(500).send("The order cannot be created!");
    }

    return res.status(200).send(newOrder);
});

//update an order's status
router.put("/:id", async (req, res) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {new: true}
    );

    if (!updatedOrder) {
        return res.status(400).send("The order's status cannot be updated!");
    }
    return res.status(200).send(updatedOrder);
});

//delete a order
router.delete("/:id", (req,res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(
                async orderItem => {
                    await OrderItem.findByIdAndRemove(orderItem).catch(
                        err => {
                            return res.status(404).json({success: false, error: err});
                        }
                    );
                }
            );
            return res.status(200).json({success: true, message: "The order is removed!"});
        } else {
            return res.status(400).json({success: false, message: "The order cannot be removed!"});
        }
    }).catch(err => {return res.status(404).json({success: false, error: err})});
});

//get total sales
router.get("/get/sales", async (req, res) => {
    const totalSales = await Order.aggregate([{
        $group: {_id: null, totalSales: {$sum: '$totalPrice'}}
    }]);
    if (!totalSales) return res.status(400).json({success: false, message: "Cannot get total sales!"});
    return res.status(200).json({success: true, "Total sales": totalSales[0].totalSales});
});

//get order history for user
router.get("/get/userorders/:userid", async (req,res) => {
    const UserOrderList = await Order.find({user: req.params.userid})
    .populate(
        {
            path: "orderItems", 
            populate: {
                path: "product",
                select: ["name", "price", "category"],
                populate: {
                    path: "category",
                    select: ["name", "color"]
                }
            }
        }
    )
    .sort({"dateOdered": -1});
    if (!UserOrderList) {
        return res.status(500).json({success: false});
    }

    res.send(UserOrderList);
});
module.exports = router; 