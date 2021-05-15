const { Category } = require('../models/category');

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});

router.get('/:id', async (req, res) => {
  try {
    const singleCategory = await Category.findById(req.params.id);

    if (singleCategory) {
      res.status(200).json({ success: true, payload: singleCategory });
    } else {
      throw new Error('Category not found');
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  });

  category = await category.save();
  if (!category) {
    return res.status(404).send('failed to create category');
  }
  res.send(category);
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
      },
      { new: true }
    );
    if (category) {
      res.status(200).send(category);
    } else {
      throw new Error('failed to update');
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then(deletedCat => {
      if (deletedCat) {
        return res.status(200).json({
          sucess: true,
          msg: `category ${deletedCat.name} was successfully deleted`
        });
      } else {
        return res
          .status(404)
          .json({ success: false, msg: `failed to delete ${deletedCat.name}` });
      }
    })
    .catch(err => {
      return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
