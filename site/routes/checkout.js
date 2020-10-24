'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();
var braintree = require('braintree');
const sqlite3 = require('sqlite3').verbose();

var newCart = require('../models/cart');

let db = new sqlite3.Database('./schema/data.db');

router.post('/', processPayment);

async function processPayment(req, res) {
  res.setHeader("Content-Type", "application/xhtml+xml");
  var cart = newCart(req.session.cart);
  var isOutOfStockError = false;
  try {
    var numberOfItemsInCart = cart.getItems().length;
    for (var index = 0; index < numberOfItemsInCart; index++) {
      db.get("SELECT * FROM products WHERE id=?", [cart.getItems()[index].item.id], check);
    }
  } catch (e) {
    console.log(e);
  }

  function check(err, row) {
    if (err) {
      throw err;
    }

    var cart = newCart(req.session.cart);
    let foundIndex = 0;
    for (let j = 0; j < numberOfItemsInCart; j++) {
      if (cart.getItems()[j].item.id == row.id) {
        foundIndex = j;
        break;
      }
    }

    if (row.stock < cart.getItems()[foundIndex].quantity) {
      isOutOfStockError = true;
      return res.redirect("/checkout?error=outOfStock");
    }
  }

  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
  });

  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  const contactDetails = req.body;
  // Create a new transaction
  var newTransaction = gateway.transaction.sale({
    amount: cart.getTotalPrice(),
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, async function(error, result) {
    
    if (result) {
      if (nonceFromTheClient == null && !isOutOfStockError) {
        
        var stmt = db.prepare("UPDATE products SET stock=? WHERE id=?");
        var stmtOrders = db.prepare("INSERT INTO orders (firstName, lastName, email, address, address2, city, zip, total, date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        var stmtOrderItems = db.prepare("INSERT INTO order_items (quantity, order_id, product_id) VALUES (?, ?, ?)");
        var numberOfCartItems = cart.getItems().length;
        var timestamp = Date.now();

        var x = await stmtOrders.run(contactDetails.firstName, contactDetails.lastName, contactDetails.email, contactDetails.address, contactDetails.address2, contactDetails.city, contactDetails.zip, cart.getTotalPrice(), timestamp, req.session.userId, populateOrderItems);
        stmtOrders.finalize();

        async function populateOrderItems(err) {
          if (err) {
            throw err;
          }

          for (var index = 0; index < numberOfCartItems; index++) {
            var newStock = cart.getItems()[index].item.stock - cart.getItems()[index].quantity;
            var itemId = cart.getItems()[index].item.id;
            await stmt.run(newStock, itemId);
            await stmtOrderItems.run(cart.getItems()[index].quantity, this.lastID, itemId);
          }
          stmt.finalize();
          stmtOrderItems.finalize();
        }
        
        res.render('checkout-complete', {
          contactDetails: contactDetails,
          products: cart.getItems(),
          totalPrice: cart.getTotalPrice(),
          layout: 'default', 
          template: 'checkout-complete'
        });
        // Delete session
        delete req.session.cart;
      }
    } else {
      console.log('Something went wrong ...');
      res.render('checkout-fail', {layout: 'default', template: 'checkout-fail'});
    }
  });
}

/* GET home page. */
router.get('/', renderCheckout);

async function renderCheckout(req, res) {
  var error = req.query.error;
  res.setHeader("Content-Type", "application/xhtml+xml");
   
  if (!req.session.cart) {
    return res.render('checkout', {
      client_authorization: process.env.CLIENT_AUTHORIZATION,
      products: null,
      error: error,
      layout: 'default', 
      template: 'checkout'
    });
  }

  var cart = newCart(req.session.cart);
  try {
    var numberOfItemsInCart = cart.getItems().length;
    for (var index = 0; index < numberOfItemsInCart; index++) {
      
      db.get("SELECT * FROM products WHERE id=?", [cart.getItems()[index].item.id], check);
    }
  } catch (e) {
    console.log(e);
  }

  function check(err, row) {
    if (err) {
      throw err;
    }
    var cart = newCart(req.session.cart);
    let foundIndex = 0;
    for (let j = 0; j < numberOfItemsInCart; j++) {
      if (cart.getItems()[j].item.id == row.id) {
        foundIndex = j;
        break;
      }
    }
    
    if (row.stock < cart.getItems()[foundIndex].quantity) {
      cart.remove(row.id);
      req.session.cart = cart.getCart();
    }
  }

  res.render('checkout', {
    client_authorization: process.env.CLIENT_AUTHORIZATION,
    products: cart.getItems(),
    totalPrice: cart.getTotalPrice(),
    error: error,
    layout: 'default', 
    template: 'checkout'
  });
}

module.exports = router;