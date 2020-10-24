"use strict";

let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
let hbs = require('express-handlebars');
let session = require('express-session');
let http = require('http');
let https = require('https');
require('dotenv').config();

const TWO_HOURS = 1000 * 60 * 60 * 2;

let db = new sqlite3.Database('./schema/data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
});

let indexRouter = require('./routes/index');
let cartRouter = require('./routes/cart');
let checkoutRouter = require('./routes/checkout');
let contactRouter = require('./routes/contact');
let shopRouter = require('./routes/shop');
let errorRouter = require('./routes/error');
let productRouter = require('./routes/product');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let accountRouter = require('./routes/account');
let logoutRouter = require('./routes/logout');
let deleteRouter = require('./routes/delete');
let forgotPasswordRouter = require('./routes/forgot-password');
let resetPasswordRouter = require('./routes/reset-password');
let orderRouter = require('./routes/order');
let adminRouter = require('./routes/admin');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine( 'hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        capitalize: function(string) {
            if (!string.localeCompare("index")) {
                return "Home";
            }
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        uppercase: function(string) {
            return string.toUpperCase();
        },
        notzero: function(value) {
            return value > 0
        },
        iszero: function(value) {
            return value == 0;
        },
    }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(session({
    name: "session_cookie",
    resave: false,
    saveUninitialized: false,
    secret: 'fhsdifhsdo;d][wae;3',
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: false
    }
}));
app.use(session({
    name: "reset_cookie",
    resave: false,
    saveUninitialized: false,
    secret: 'fhsdifhsdo;d][wae;4',
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: false
    }
}));
app.use(express.static(path.join(__dirname, "public")));

// res.locals is an object passed to hbs engine
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});


app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/product', productRouter);
app.use('/checkout', checkoutRouter);
app.use('/contact', contactRouter);
app.use('/shop', shopRouter);
app.use('/error', errorRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/account', accountRouter);
app.use('/logout', logoutRouter);
app.use('/delete', deleteRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/reset-password', resetPasswordRouter);
app.use('/order', orderRouter);
app.use('/admin', adminRouter);

let port = 8080;
let portHttps = 8443;

if (process.env.USE_SSL == true) {
    startHttps();
} else {
    start();
}

async function start() {
    try {
        let httpServer = http.createServer(app);
        httpServer.listen(8080, "localhost");
        let address = "http://localhost";
        if (port != 80) {
            address = address + ":" + port;
        }
        console.log("Server running at", address);
    } catch (err) {
        console.log(err);
        process.exit(1);
    } 
}

async function startHttps() {
    try {
        let privateKey = fs.readFileSync('ssl/coffeebag.key', 'utf8');
        let certificate = fs.readFileSync('ssl/coffeebag.crt', 'utf8');
        let credentials = {key: privateKey, cert: certificate};
        let httpsServer = https.createServer(credentials, app);
        httpsServer.listen(8443, "localhost");
        let address = "https://localhost";
        if (portHttps != 80) {
            address = address + ":" + portHttps;
        }
        console.log("Server running at", address);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}