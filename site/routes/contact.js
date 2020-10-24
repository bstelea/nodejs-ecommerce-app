'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const hbsNodemailer = require('nodemailer-express-handlebars');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/xhtml+xml");
  res.render('contact', {layout: 'default', template: 'contact'});
});

router.post('/', function(req, res, next) {
  const contactDetails = req.body;

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
    subject: 'Coffee Bag Contact Form Request',
    template: 'contact-email-client',
    context: {
      firstName: contactDetails.firstName
    }
  };

  var mailOptions2 = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_FROM,
    subject: 'Admin: Coffee Bag Contact Form Request',
    template: 'contact-email-admin',
    context: {
      firstName: contactDetails.firstName,
      lastName: contactDetails.lastName,
      email: contactDetails.email,
      message: contactDetails.message
    }
  };

  transporter.sendMail(mailOptions2, function(error, info){
    if (error) {
      console.log(error);
    }
  });

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      res.setHeader("Content-Type", "application/xhtml+xml");
      res.render('contact-complete', {layout: 'default', template: 'contact-complete'});
    }
  }); 
});

module.exports = router;