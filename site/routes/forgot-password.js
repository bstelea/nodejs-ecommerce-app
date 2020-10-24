var path = require('path');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const hbsNodemailer = require('nodemailer-express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

let db = new sqlite3.Database('./schema/data.db');

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/account');
    } else {
        next();
    }
};

/* GET home page. */
router.get('/', redirectHome, renderForgotPassword);

function renderForgotPassword(req, res) {
    res.setHeader("Content-Type", "application/xhtml+xml");
    res.render('forgot-password', {layout: 'default', template: 'forgot-password'});
}

router.post('/', redirectHome, sendForgotPasswordEmail);

function sendForgotPasswordEmail(req, res) {

    var resetLink = 'http://localhost:8080/reset-password?';
    const contactDetails = req.body;

    var stmt = db.prepare("SELECT * FROM users WHERE email=?");
    stmt.get(contactDetails.email, findUser);
    stmt.finalize();

    function findUser(err, row) {
        if (err) {
            throw err;
        }
        var user = row;
        if (user) {
            // Generate nonce and store it in session
            var nonce = crypto.randomBytes(16).toString('hex');
            resetLink = resetLink.concat('nonce=' + nonce);
            // Store user.id in the URL
            resetLink = resetLink.concat('&userId=' + user.id);
            // Store cookie with nonce
            req.session.resetPassword = nonce;
            // Send the URL via mail
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_FROM_PWD
                }
            });
        
            transporter.use('compile', hbsNodemailer({
                viewEngine: {
                extName: '.hbs',
                partialsDir: path.join(__dirname, '../views/partials'),
                layoutsDir: path.join(__dirname, '../views/layouts'),
                defaultLayout: 'email.hbs'
                },
                viewPath: path.join(__dirname, '../views'),
                extName: '.hbs',
            }));
            
            var mailOptions = {
                from: process.env.EMAIL_FROM,
                to: contactDetails.email,
                subject: 'Coffee Bag Reset Password Request',
                template: 'reset-password-email',
                context: {
                link: resetLink
                }
            };

            transporter.sendMail(mailOptions, sendResetEmail);
            
            function sendResetEmail(err) {
                if (err) {
                    throw err;
                } else {
                    res.setHeader("Content-Type", "application/xhtml+xml");
                    res.render('reset-password-confirmation', {layout: 'default', template: 'reset-password-confirmation'});
                }
            }
        }
    }
}

module.exports = router;
