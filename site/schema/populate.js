"use strict";

var sql = require('sqlite3');
var db = new sql.Database('data.db');
var boilerplate = "insert into products (title, description, price, stock, category, image) values";

db.parallelize(insert);

function insert() {
    db.run( boilerplate + "('Vietnam Blend', 'Vietnam Blend Description', 2, 14, 'Country Blend', './images/vietnam.jpg')");
    db.run( boilerplate + "('Indonesia Blend', 'Indonesia Blend Description', 4, 14, 'Country Blend', './images/indonesia.jpg')");
    db.run( boilerplate + "('Brazil Blend', 'Brazil Blend Description', 6, 14, 'Country Blend', './images/brazil.jpg')");
    db.run( boilerplate + "('Colombia Blend', 'Colombia Blend Description', 7, 14, 'Country Blend', './images/colombia.jpg')");
    db.run( boilerplate + "('Ethiopia Blend', 'Ethiopia Blend Description', 9, 14, 'Country Blend', './images/ethiopia.jpg')");
    db.run( boilerplate + "('Uganda Blend', 'Uganda Blend Description', 7, 14, 'Country Blend', './images/uganda.jpg')");

    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Breakfast Blend', 'Breakfast Blend Description', 4, 14, 'Flavour Blend', './images/breakfast-blend.jpg','./images/breakfast-blend-left.jpg', './images/breakfast-blend-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Chilli Chocolate', 'Chilli Chocolate Coffee Description', 1, 14, 'Flavour Blend', './images/chilli.jpg','./images/chilli-left.jpg', './images/chilli-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Salted Caramel', 'Salted Caramel Description', 5, 14, 'Flavour Blend', './images/caramel.jpg','./images/caramel-left.jpg', './images/caramel-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Hazelnut Haze', 'Hazelnut Haze Description', 7, 14, 'Flavour Blend', './images/hazelnut.jpg','./images/hazelnut-left.jpg', './images/hazelnut-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('India Blend', 'India Blend Coffee Description', 5, 0, 'Country Blend', './images/india.jpg','./images/india-left.jpg', './images/india-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Jamaica Blue Mountain Coffee', 'Jamaica Blue Mountain Coffee Description', 31, 14, 'Country Blend', './images/jamaican.jpg','./images/jamaican-left.jpg', './images/jamaican-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Fresh Mint Coffee', 'Fresh Mint Coffee Description', 11, 14, 'Flavour Blend', './images/mint.jpg','./images/mint-left.jpg', './images/mint-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Monsoon Malabar Coffee', 'Monsoon Malabar Coffee Description', 16, 14, 'Country Blend', './images/monsoon.jpg','./images/monsoon-left.jpg', './images/monsoon-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('Pumpkin Spice Coffee', 'Pumpkin Spice Coffee Description', 9, 0, 'Flavour Blend', './images/pumpkin.jpg','./images/pumpkin-left.jpg', './images/pumpkin-right.jpg')");
    db.run("insert into products (title, description, price, stock, category, image, image2, image3) values ('French Vanilla', 'French Vanilla Description', 8, 14, 'Flavour Blend', './images/vanilla.jpg','./images/vanilla-left.jpg', './images/vanilla-right.jpg')");

    db.run("insert into users (id, firstName, lastName, email, password) values (1, 'Admin', 'User', 'noreply.coffeebag.orders@gmail.com', '$2b$10$SDfwHR35QgLaXuKAn923i.7UR13LBhUgZPmsuKdpFV0hClHQBedQG')");
}