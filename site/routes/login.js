var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;

let db = new sqlite3.Database('./schema/data.db');

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/account');
    } else {
        next();
    }
};

router.get('/', redirectHome, function(req, res, next) {
    const error = req.query.error;
    res.setHeader("Content-Type", "application/xhtml+xml");      
    res.render('login', {layout: 'default', template: 'login', error: error});
});

router.post('/', redirectHome, (req, res) => {
    const {
        email, 
        password
    } = req.body;

    db.serialize(() => {
        db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
            if (err) {
                throw err;
            }
            user = row;
            if (user) {
                if (bcrypt.compareSync(password, row.password)) {
                    req.session.userId = user.id;
                    if (user.email == "noreply.coffeebag.orders@gmail.com") {
                        return res.redirect('/admin');
                    }
                    return res.redirect('/account');
                }
            }

            res.redirect('/login?error=invalid');
        });
    });
});

module.exports = router;
