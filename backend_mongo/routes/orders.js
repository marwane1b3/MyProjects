const { Order } = require('../models/orders');
const { OrderItem } = require('../models/orderItem');
const { User } = require('../models/User');
const express = require('express');

const router = express.Router();

// public route GET

router.get('/', async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate('user', 'name')
      .sort({ dateOrdered: -1 });

    if (!orderList) {
      throw new Error('No orders found');
    } else {
      res.status(200).json({ success: true, payload: orderList });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' }
      });

    if (!order) {
      throw new Error('No order was found');
    } else {
      res.status(200).json({ success: true, payload: order });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    // 1 - les id des orderItems [].
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async item => {
        let newOrderItem = new OrderItem({
          quantity: item.quantity,
          product: item.product
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const resolvedOrderItemIds = await orderItemsIds;
    //2 le prix total :
    const totalPrices = await Promise.all(
      resolvedOrderItemIds.map(async orderItemId => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          'product',
          'price'
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    //3 lid user if exists :
    const userId = await User.findById(req.params.user);
    if (!userId) throw new Error('no user found');
    //3 ajouter le tout
    let order = new Order({
      orderItems: resolvedOrderItemIds,
      shippingAdress1: req.body.shippingAdress1,
      shippingAdress2: req.body.shippingAdress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: userId
    });

    order = await order.save();
    if (!order) {
      throw new Error('failed to create an order');
    } else {
      res.status(200).json({ success: true, payload: order });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      { new: true, useFindAndModify: false }
    );

    if (order) {
      res.status(200).json({ success: true, payload: order });
    } else {
      throw new Error('failed to update status order');
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const delOrder = await Order.findByIdAndRemove(req.params.id);

    if (delOrder) {
      let delitems = [];
      delOrder.orderItems.map(async orderItem => {
        delitems = await OrderItem.findByIdAndRemove(orderItem);
      });
      if (delitems) {
        res.status(200).json({ success: true, payload: delOrder });
      } else {
        throw new Error('children not deleted');
      }
    } else {
      throw new Error('something went wrong');
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: error.message
    });
  }
});

/**
 * pour l'admin
 *  total sales
 */
router.get('/get/totalprices', async (req, res) => {
  try {
    const sumSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);

    if (!sumSales) {
      throw new Error('no sales yet ');
    } else {
      res
        .status(200)
        .json({ success: true, payload: sumSales.pop().totalSales });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: error.message
    });
  }
});
// le nombre de tout les ordres
router.get('/get/count', async (req, res) => {
  try {
    const countOrder = await Order.countDocuments(count => count);
    if (countOrder) {
      res.status(200).json({ success: true, count: countOrder });
    } else {
      throw new Error('No products found.');
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: message.error });
  }
});
// les ordres par user

router.get('/get/userorders/:userId', async (req, res) => {
  try {
    const userOrderList = await Order.find({ user: req.params.userId })
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' }
      })
      .sort({ dateOrdered: -1 });

    if (userOrderList) {
      res.status(200).json({ success: true, payload: userOrderList });
    } else {
      throw new Error('no user found');
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});
module.exports = router;
