const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true
    }
  ],
  shippingAdress1: {
    type: String,
    required: true
  },
  shippingAdress2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Pending'
  },
  totalPrice: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateOrdered: {
    type: Date,
    default: Date.now
  }
});

exports.Order = mongoose.model('Order', ordersSchema);

/**
Order Example:
{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : " ibn tachfine res almawada ",
    "shippingAddress2" : "23 A",
    "city": "Casablanca",
    "zip": "22008",
    "country": "morocco",
    "phone": "0675739170",
    "user": "5fd51bc7e39ba856244a3b44"
}
 */
