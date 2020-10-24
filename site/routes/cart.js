var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

var fs = require('fs');

var newCart = require('../models/cart');

var db = new sqlite3.Database('./schema/data.db');

/* GET home page. */
router.get('/', renderCart);

function renderCart(req, res) {
  res.setHeader("Content-Type", "application/xhtml+xml");
  if (!req.session.cart) {
    return res.render('cart', {
      products: null,
      layout: 'default', 
      template: 'cart'
    });
  }

  var cart = newCart(req.session.cart);
  
  res.render('cart', {
    title: 'NodeJS Shopping Cart',
    products: cart.getItems(),
    totalPrice: cart.getTotalPrice(),
    layout: 'default', 
    template: 'cart'
  });
}

module.exports = router;