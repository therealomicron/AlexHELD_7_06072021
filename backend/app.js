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
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100
  });
app.use(helmet()); //sets HTTP headers
app.use(limiter);

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
app.use(express.static(path.join(__dirname, 'frontend')));
const submissionsRouter = require('./routes/submissions');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');
app.use('/api/auth/submissions', submissionsRouter);
app.use('/api/auth/users', usersRouter);
app.use('/api/auth/comments', commentsRouter);
app.use('/api/auth/likes', likesRouter);
app.use('/home', function(req, res) {res.sendFile(path.join(__dirname + '/frontend/index.html'))})
const db = require("./models/index");
db.sequelize.sync({
	alter: true
});

module.exports = app;