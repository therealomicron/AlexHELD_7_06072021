require('dotenv').config();
const express = require('express');
const path = require('path');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('p_sept', process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
});

const indexRouter = require('./routes/submissions');
const usersRouter = require('./routes/users');

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
