"use strict";

var sql = require('sqlite3');
var db = new sql.Database("data.db");

db.serialize(create);

function create() {
    // Turn off foreign key checks
    db.run("pragma foreign_keys = off");

    // Drop table Products
    db.run("drop table if exists products");
    // Drop table Users
    db.run("drop table if exists users");
    // Drop table Orders
    db.run("drop table if exists orders");
    // Drop table Order_Items
    db.run("drop table if exists order_items");

    // Create table Products
    db.run("create table products (id integer not null primary key autoincrement, title text not null, description text not null, price integer not null, stock integer not null, category text not null, image text not null, image2 text null, image3 text null)");
    // Create table Users
    db.run("create table users (id integer not null primary key autoincrement, firstName text not null, lastName text not null, email text not null, password text not null)");
    // Create table Orders
    db.run("create table orders (id integer not null primary key autoincrement, firstName text not null, lastName text not null, email text not null, address text not null, address2 text null, city text not null, zip text not null, total integer not null, date integer not null, user_id integer null, foreign key (user_id) references user (id) on delete cascade on update no action)");
    // Create table Order_Items
    db.run("create table order_items (id integer not null primary key autoincrement, quantity integer not null, order_id integer not null, product_id integer not null, foreign key (order_id) references orders (id) on delete cascade on update no action, foreign key (product_id) references products (id) on delete cascade on update no action)");

    // Turn on foreign key checks
    db.run("pragma foreign_keys = on");
    
}