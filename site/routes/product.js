"use strict";

var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./schema/data.db');


router.get('/', function (req, res, next) {
    var productId = req.query.id;

    db.serialize(() => {
        db.get('select * from products where id=?', productId, (err, row) => {
            if (err) {
                throw err;
            }
            res.setHeader("Content-Type", "application/xhtml+xml"); 
            res.render('product', 
                { 
                    title: 'NodeJS Shopping Cart',
                    product: row,
                    layout: 'default', 
                    template: 'product'
                }
            );
        });
    });      
});

module.exports = router;