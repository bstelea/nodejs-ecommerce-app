"use strict";

var path = require('path');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const hbsNodemailer = require('nodemailer-express-handlebars');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/xhtml+xml");
  res.render('index', {layout: 'default', template: 'index'});
});

router.post('/newsletter', function(req, res, next) {
  var receiver = req.body.receiverEmail;

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
    to: receiver,
    subject: 'Coffee Bag Newsletter',
    template: 'newsletter-email'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      res.setHeader("Content-Type", "application/xhtml+xml");
      res.render('newsletter', {layout: 'default', template: 'newsletter'});
    }
  }); 
});

module.exports = router;
