const router = require('express').Router();
const Customer = require('../models/customer');
const Product = require('../models/product');
const Order = require('../models/order');

// Your routing code goes here

//Getting All Customers
router.get('/customer',async (req,res)=>{
    try {
        const allData = await Customer.find();
        res.json(allData);
    }
    catch(error) {
        console.log(error.message);
    }
})

router.get('/customer/:id',async (req,res)=>{
    try {
        const allData = await Customer.findById(req.params.id);
        res.json(allData);
    }
    catch(error) {
        console.log(error.message);
    }
})


//Getting All Items
router.get('/inventory',async (req,res)=>{
    try {
        const allData = await Product.find();
        res.json(allData);
    }
    catch(error) {
        console.log(error.message);
    }
})

//Getting All Orders
router.get('/orders',async (req,res)=>{
    try {
        const allData = await Order.find();
        res.json(allData);
    }
    catch(error) {
        console.log(error.message);
    }
})

router.get('/orders/:Id', async (req, res) => {
    try {
        const data = await Order.findById(req.params.Id);
        return res.json(data);
    }
    catch(error) {
        return res.json({
            error: error.message
        })
    }
})

router.get('/product/:type',async (req,res)=> {
    try {
        const allData = await Product.find({product_type: req.params.type});
        res.json(allData);
    }
    catch(error) {
        console.log(error.message);
    }
})

router.get('/inventory/:type',async (req,res)=> {
    try {
        const allData = await Product.find({product_type: req.params.type});
        res.json(allData);
    }
    catch(error) {
        console.log(error.message);
    }
})

router.get('/product/:id',async (req,res)=> {
    try {
        const allData = await Product.findById(req.params.id);
        res.json(allData);
    }
    catch(error) {
        console.log(error.message);
    }
})

router.post('/product', async (req, res) => {
    const inventoryData = req.body;
    let ivid = 'PRD5';
    const allData = await Product.find();
    if(allData.length === 0) {
        ivid = ivid + '01'
    }
    else if(allData.length <= 9) {
        ivid = ivid + "0" + (allData.length + 1)
    }
    else {
        ivid = ivid + (allData.length + 1)
    }
    inventoryData.product_id = ivid;
    try{
        const newProduct = new Product(inventoryData);
        await newProduct.save();
        return res.json({
            status: "Success",
            result: newProduct
        });
    }
    catch(error) {
        return res.send({
            status: "Failed to add Product",
            message: error.message
        });
    }
})

router.post('/customer', async (req, res) => {
    const customerData = req.body;
    let cuid = 'CT1';
    const allData = await Customer.find();
    if(allData.length === 0) {
        cuid = cuid + '01'
    }
    else if(allData.length <= 9) {
        cuid = cuid + "0" + (allData.length + 1)
    }
    else {
        cuid = cuid + (allData.length + 1)
    }
    customerData.customer_id = cuid;
    try{
        const newCustomer = new Customer(customerData);
        await newCustomer.save();
        return res.json({
            status: "Success",
            result: newCustomer
        });
    }
    catch(error) {
        return res.send({
            status: "Failed to add Customer",
            message: error.message
        });
    }
})

router.put('/product/:pn/:aq', async (req, res) => {
    const data = await Product.find({product_name:req.params.pn});
    let updates = {
        available_quantity : parseInt(req.params.aq)
    }
    try {
        await Product.findByIdAndUpdate(data._id, updates);
        let ans = await Product.findById(data._id);
        console.log(ans)
        return res.json({
            status: "success",
            result: ans
        })
    }
    catch(err) {
        return res.json({
            status: "Failed",
            messsage: err.message
        })
    }
})

router.post('/order', async (req, res) => {
    const orderData = req.body;
    let findCust = await Customer.find({customer_id:orderData.customer_id});
    let findInv = await Product.find({product_id:orderData.product_id});
    if(findCust.length == 0) {
        return res.json({
            status: "Failed to Place Order",
            message: "Customer Not Found with given Id"
        })
    }
    else if(findInv.length == 0) {
        return res.json({
            status: "Failed to Place Order",
            message: "Item NOT Found with given Id"
        })
    }

    let q = findInv[0].available_quantity
    if(orderData.quantity > q) {
        return res.json({
            status: "Failed to Place Order",
            message: "OUT OF STOCK"
        })
    }
    let b = findCust[0].balance;
    let t = findInv[0].product_price * orderData.quantity;
    if(t > b) {
        return res.json({
            status: "Failed to Place Order",
            message: "Insufficinet Funds"
        })
    }
    orderData.product_name = findInv[0].product_name;
    let inv_id = findInv[0]._id;
    let C_id = findCust[0]._id;
    let updates1 = {
        balance: b - t
    }
    let updates = {
        available_quantity : q - orderData.quantity
    }
    try {
        const newOrder = new Order(orderData);
        await newOrder.save();
        await Product.findByIdAndUpdate(inv_id, updates);
        await Customer.findByIdAndUpdate(C_id, updates1)
        return res.json({
            status: "Success",
            result: newOrder
        });
    }
    catch(error) {
        return res.send({
            status: "Failed to Place Order",
            message: error.message
        });
    }
})

module.exports = router;