var express = require('express');
var router = express.Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};

router.post('/', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/account');
        }

        res.clearCookie("session_cookie");
        res.redirect('/login');
    });
});

module.exports = router;
