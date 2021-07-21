require('dotenv').config(); //masks sensitive information
const cors = require('cors');
const corsOptions = {
	origin: "http://localhost:8081"
};
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path'); //module for working with file and directory paths

const Sequelize = require('sequelize');
const sequelize = new Sequelize('p_sept', process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
});

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//const submissionsRouter = require('./routes/submissions');
const usersRouter = require('./routes/users');
//app.use('/', submissionRouter);
app.use('/api/auth/users', usersRouter);
const db = require("./models/index");
db.sequelize.sync();







module.exports = app;
