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

/* GET home page. */
router.get('/', redirectHome, renderResetPassword);

function renderResetPassword(req, res) {
    const { nonce, userId } = req.query;
    res.setHeader("Content-Type", "application/xhtml+xml");

    if ((nonce == req.session.resetPassword) && (req.session.resetPassword != null)) {
        res.render('reset-password', {layout: 'default', template: 'reset-password', nonce: nonce, userId: userId});
    } else {
        res.render('reset-password-error', {layout: 'default', template: 'reset-password-error'});
    }
}

router.post('/', redirectHome, sendResetPasswordRequest);

function sendResetPasswordRequest(req, res) {

    const form = req.body;

    if (form.nonce == req.session.resetPassword) {
        var newPassword = form.newPassword;

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newPassword, salt);

        var stmt = db.prepare("UPDATE users SET password=? WHERE id=?");
        stmt.run(hash, form.userId, setNewPassword);
        stmt.finalize();

        function setNewPassword(err) {
            if (err) {
                throw err;
            }
            return res.redirect("/login");
        }
    } else {
        res.setHeader("Content-Type", "application/xhtml+xml");
        res.render('reset-password-error', {layout: 'default', template: 'reset-password-error'});
    }

    res.clearCookie('reset_cookie');
}

module.exports = router;
