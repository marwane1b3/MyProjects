const { User } = require('../models/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const generateToken = require('../authMiddleware/generateToken');

/**
 * GET USERS
 *
 */

router.get('/', async (req, res) => {
  try {
    const userList = await User.find().select('-passwordHash');
    if (userList.length > 0) {
      res.status(200).json({ success: true, payload: userList });
    } else {
      throw new Error('no users found');
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id).select(
      '-passwordHash'
    );

    if (singleUser) {
      res.status(200).json({ success: true, payload: singleUser });
    } else {
      throw new Error('Category not found');
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 8),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country
    });

    user = await user.save();
    if (user) {
      res.status(200).json({
        success: true,
        payload: user,
        token: generateToken(user)
      });
    } else {
      throw new Error('user sign up failed');
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 8),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country
    });

    user = await user.save();
    if (user) {
      res.status(200).json({
        success: true,
        payload: user,
        token: generateToken(user)
      });
    } else {
      throw new Error('user sign up failed');
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const logUser = await User.findOne({ email: req.body.email });
    if (
      logUser &&
      bcrypt.compareSync(req.body.password, logUser.passwordHash)
    ) {
      res.status(200).json({
        success: true,
        message: 'user authenticated',
        token: generateToken(logUser)
      });
    } else {
      throw new Error('wrong email or password .');
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 8);
    } else {
      newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
      },
      { new: true }
    );

    if (user) {
      res.status(200).json({ success: true, payload: user });
    } else {
      throw new Error('update failed ');
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: 'the user is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'user not found!' });
      }
    })
    .catch(err => {
      return res.status(500).json({ success: false, msg: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments(count => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount
  });
});

module.exports = router;
