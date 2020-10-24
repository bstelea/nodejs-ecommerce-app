var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./schema/data.db');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else if (req.session.userId == process.env.ADMIN_ID) {
        res.redirect('/admin');
    } else {
        next();
    }
};

router.get('/', redirectLogin, renderAccount);

function renderAccount(req, res) {
    const userId = req.session.userId;
    var stmt = db.prepare("SELECT * FROM users WHERE id=?");
    stmt.get(userId, getUser);
    stmt.finalize();

    function getUser(err, row) {
        if (err) {
            throw err;
        }

        var stmtOrders = db.prepare("SELECT * FROM orders WHERE user_id=?");
        stmtOrders.all(userId, fetchOrders);
        stmtOrders.finalize();

        function fetchOrders(err, rows) {
            if (err) {
                throw err;
            }
            res.setHeader("Content-Type", "application/xhtml+xml");   
            res.render('account', {layout: 'default', template: 'account', user: row, orders: rows});
        }
    }
}

module.exports = router;
