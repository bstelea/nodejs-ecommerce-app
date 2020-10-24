var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./schema/data.db');

const redirectAdmin = (req, res, next) => {
    if (!(req.session.userId == process.env.ADMIN_ID)) {
        res.redirect('/login');
    } else {
        next();
    }
};

router.get('/', redirectAdmin, renderAdmin);

function renderAdmin(req, res) {
    res.setHeader("Content-Type", "application/xhtml+xml");  
    var stmt = db.prepare("SELECT * FROM users WHERE id=?");
    stmt.get(process.env.ADMIN_ID, fetchAdmin);

    function fetchAdmin(err, admin) {
        if (err) {
            throw err;
        }
        db.all("SELECT * FROM orders", fetchAllOrders);

        function fetchAllOrders(err, orders) {
            if (err) {
                throw err;
            }

            db.get("SELECT COUNT(*) AS count FROM orders", getNumberOfOrders);

            function getNumberOfOrders(err, numberOfOrders) {
                if (err) {
                    throw err;
                }
                db.get ("SELECT COUNT(*) AS count FROM products WHERE stock=0", getNumberOfStockZeroProducts);

                function getNumberOfStockZeroProducts(err, numberOfStockZeroProducts) {
                    if (err) {
                        throw err;
                    }
                    db.get("SELECT SUM(total) AS sum FROM orders", getTotalRevenue);

                    async function getTotalRevenue(err, total) {
                        try {
                            res.render('admin', {layout: 'default', template: 'admin', admin: admin, orders: orders, numberOfOrders: numberOfOrders.count, numberOfStockZeroProducts: numberOfStockZeroProducts.count, totalRevenue: total.sum});
                        } catch(err) {
                            throw err;
                        }
                    }

                }

            }
        }
    }
}

module.exports = router;
