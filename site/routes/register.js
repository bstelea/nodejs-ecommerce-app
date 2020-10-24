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

router.get('/', redirectHome, function(req, res) {
    res.setHeader("Content-Type", "application/xhtml+xml");     
    res.render('register', {layout: 'default', template: 'register'});
});

router.post('/', redirectHome, (req, res) => {
    const {
        firstName,
        lastName,
        email, 
        password
    } = req.body;

    if (firstName && lastName && email && password) {
        var stmt = db.prepare('SELECT * FROM users WHERE email=?');
        stmt.get(email, checkUser);
        stmt.finalize();

        function checkUser(err, row) {
            if (err) {
                throw err;
            }
            var user = row;
            if (user == null) {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(password, salt);
                var stmt = db.prepare("insert into users (firstName, lastName, email, password) values (?, ?, ?, ?)");
                stmt.run(firstName, lastName, email, hash, storeUser);
                stmt.finalize();

                function storeUser(err) {
                    if (err) {
                        throw err;
                    }

                    req.session.userId = this.lastID;        

                    res.redirect('/account');
                }
            } else {
                res.redirect('/register');
            }
        }

    } else {
        res.redirect('/register');
    }

    
});


module.exports = router;
