const mongooose = require('mongoose');

const OrderSchema = new mongooose.Schema({
    // Your code goes here
    customer_id : {
        type : String,
        required: true,
    },
    product_id : {
        type : String,
        required: true,
    },
    product_name : {
        type: String,
        required: true
    },
    quantity : {
        type: Number,
        default: 0
    }
})

const Order = mongooose.model('Order', OrderSchema);

module.exports = Order;