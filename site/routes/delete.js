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

router.post('/', redirectLogin, (req, res) => {
    const userId = req.session.userId;

    db.serialize(() => {
        var stmt = db.prepare("delete from users where id=?");
        stmt.run(userId);
        stmt.finalize();
    });

    req.session.destroy(err => {
        if (err) {
            return res.redirect('/account');
        }

        res.clearCookie("session_cookie");
        res.redirect('/login');
    });
});

module.exports = router;