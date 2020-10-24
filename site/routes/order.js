var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./schema/data.db');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};

router.get('/', redirectLogin, renderIndividualOrder);

function renderIndividualOrder(req, res) {
    const orderId = req.query.orderId;

    var stmt = db.prepare("SELECT * FROM orders WHERE id=?");
    stmt.get(orderId, fetchOrder);
    stmt.finalize();

    function fetchOrder(err, row) {
        if (err) {
            throw err;
        }
        if (row.user_id == req.session.userId || req.session.userId == process.env.ADMIN_ID) {
            var dateObject = new Date(row.date);

            var stmtProducts = db.prepare("SELECT products.*, order_items.quantity FROM order_items INNER JOIN products ON products.id=order_items.product_id WHERE order_items.order_id=?");
            stmtProducts.all(orderId, fetchProducts);

            function fetchProducts(err, rows) {
                if (err) {
                    throw err;
                }
                res.setHeader("Content-Type", "application/xhtml+xml"); 
                res.render('order', {layout: 'default', template: 'order', order: row, day: dateObject.getDate(), month: dateObject.getMonth() + 1, year: dateObject.getFullYear(), hour: dateObject.getHours(), minute: dateObject.getMinutes(), second: dateObject.getSeconds(), products: rows});
            }
        } else {
            res.redirect('/account');
        }
    }
}

module.exports = router;
