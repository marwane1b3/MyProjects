const express = require('express');

const router = express.Router();

const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');
// image handling for products using multer lib

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let errorValid = new Error('unvalid type file(jpg ,jpeg,png)');
    if (isValid) {
      errorValid = null;
    }
    cb(errorValid, 'public/uploads');
  },
  filename: function(req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extention = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extention}`);
  }
});

const uploadOptions = multer({ storage: storage });
//routes

/**
 * routeName: getProducts
 * api call : http://localhost/api/v1/products
 * Security : public
 * type     : GET
 */
router.get(`/`, async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(',') };
    }
    const productList = await Product.find(filter).populate('category');

    if (!productList) {
      throw new Error('failed loading list');
    }
    res.status(200).json({ success: true, payload: productList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
/**
 * routeName: getProductById
 * api call : http://localhost/api/v1/products/id
 * Security : public
 * type     : GET
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new Error('invalid Product id');
    }
    const findProduct = await Product.findById(req.params.id).populate(
      'category'
    );
    if (findProduct)
      res.status(200).json({ success: true, payload: findProduct });
    else throw new Error('Product not found');
  } catch (error) {
    res.status(404).json({ sucess: false, message: error.message });
  }
});
/**
 * routeName: postProduct
 * api call : http://localhost/api/v1/products
 * Security : public
 * type     : POST
 */
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  //   console.log(req.file);
  try {
    // check if cat exists
    const category = Category.findById(req.body.category);
    if (!category) throw new Error('invalid category ');
    //check and add filename and url of image
    const file = req.file;
    if (!file) throw new Error('no image selected');
    const fileName = req.file.filename;
    const basPath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    // populate the fields
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basPath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if (product) {
      res.status(200).json({ success: true, payload: product });
    } else {
      throw new Error('failed to create Product');
    }
  } catch (error) {
    res.status(500).json({ err: error.message, sucess: false });
  }
});
/**
 * routeName: updateProduct
 * api call : http://localhost/api/v1/products/id
 * Security : public
 * type     : PUT
 */

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new Error('invalid Product id');
    }
    const category = Category.findById(req.body.category);
    if (!category) throw new Error('invalid category ');

    const reqProduct = await Product.findById(req.params.id);
    if (!reqProduct) throw new Error('product not found');

    const file = req.file;
    let imgPath;

    if (file) {
      const fileName = req.file.filename;
      const basPath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      imgPath = `${basPath}${fileName}`;
    } else {
      imgPath = reqProduct.image;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imgPath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
      },
      { new: true, useFindAndModify: false }
    );
    if (!product) throw new Error('update failed');
    res.status(200).json({ success: true, payload: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});
/**
 * routeName: deletProduct
 * api call : http://localhost/api/v1/products/id
 * Security : public
 * type     : DELETE
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new Error('invalid Product id');
    }
    const deleteProduct = await Product.findByIdAndRemove(req.params.id, {
      findOneAndDelete: false
    });
    if (deleteProduct) {
      res.status(200).json({ sucess: true, payload: deleteProduct });
    } else {
      throw new Error('product not found');
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});
/**
 * routeName: countProducts
 * api call : http://localhost/api/v1/products/get/count
 * Security : PRIVATE(authentification)
 * type     : GET
 */

router.get('/get/count', async (req, res) => {
  try {
    const countProduct = await Product.countDocuments(count => count);
    if (countProduct) {
      res.status(200).json({ success: true, count: countProduct });
    } else {
      throw new Error('No products found.');
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});
/**
 * routeName: featuredProducts
 * api call : http://localhost:3000/api/v1/products/get/featured/:id?
 * Security : PRIVATE
 * type     : GET
 */
router.get('/get/featured/:count?', async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    let fproducts;
    if (count > 0) {
      fproducts = await Product.find({ isFeatured: true }).limit(+count);
    } else {
      fproducts = await Product.find({ isFeatured: true });
    }
    if (fproducts) {
      res.status(200).json({ success: true, payload: fproducts });
    } else {
      throw new Error('no featured product found');
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});

router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw new Error('invalid Product id');
      }
      let imgPaths = [];
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      const files = req.files;
      if (files) {
        files.map(file => {
          imgPaths.push(`${basePath}${file.filename}`);
        });
      } else {
        throw new Error('oops upload gallery failed');
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imgPaths
        },
        { new: true, useFindAndModify: false }
      );
      if (product) {
        res.status(200).json({ success: true, payload: product });
      } else {
        throw new Error('no files uploaded');
      }
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
  }
);
module.exports = router;
