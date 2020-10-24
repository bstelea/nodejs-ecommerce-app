// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('shop', {layout: 'default', template: 'shop'});
//   res.setHeader("Content-Type", "application/xhtml+xml");
// });

// module.exports = router;

var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

var fs = require('fs');

var newCart = require('../models/cart');
var products;
let db = new sqlite3.Database('./schema/data.db');

router.get('/', function (req, res, next) {
  db.serialize(() => {
    var sort = req.query.sort;
    var category = req.query.category;
    var startPrice = req.query.startPrice;
    var endPrice = req.query.endPrice;
    var query = `SELECT * FROM products`;

    if (category != null || startPrice != null) {
      query = `SELECT * FROM products WHERE category LIKE ? AND price BETWEEN ? AND ?`;

      if (category == 'All') {
        category = "%%";
      }
    }

    if (sort == 'latest') {
      query =  `SELECT * FROM products ORDER BY id DESC`;
    } else if (sort == 'price-asc') {
      query = `SELECT * FROM products ORDER BY price ASC`;
    } else if (sort == 'price-desc') {
      query = `SELECT * FROM products ORDER BY price DESC`;
    } else if (sort == 'name-asc') {
      query = `SELECT * FROM products ORDER BY title ASC`;
    } else if (sort == 'name-desc') {
      query = `SELECT * FROM products ORDER BY title DESC`;
    }
    
    db.all(query, [category, startPrice, endPrice], (err, rows) => {
      if (err) {
        throw err;
      }
      products = rows;
     
      res.setHeader("Content-Type", "application/xhtml+xml");  
      res.render('shop', 
        { 
          title: 'NodeJS Shopping Cart',
          products: products,
          layout: 'default', 
          template: 'shop'
        }
      );
    });
  });
});

router.get('/add/:id', function(req, res, next) {

  var productId = req.params.id;
  var cart = newCart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart.getCart();
  res.redirect('/shop');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = newCart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart.getCart();
  res.redirect('/cart');
});

module.exports = router;