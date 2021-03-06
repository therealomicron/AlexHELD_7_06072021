require('dotenv').config(); //masks sensitive information
const cors = require('cors');
const corsOptions = {
	origin: "http://localhost:8081"
};
const morgan = require('morgan');
const express = require('express');
const app = express();
const path = require('path'); //module for working with file and directory paths
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000
  });
app.use(helmet()); //sets HTTP headers
app.use(helmet.contentSecurityPolicy({
	useDefaults: true,
	directives: {
		"script-src": ["'self'", "*.fontawesome.com", "https://ka-f.fontawesome.com", "*.cloudflare.com", "*.bootstrapcdn.com", "code.jquery.com", "eval", "'unsafe-eval'"],
		"default-src": ["'self'", "https://ka-f.fontawesome.com"]
	}
}))
app.use(limiter);

const Sequelize = require('sequelize');
const sequelize = new Sequelize('p_sept', process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
});

app.use(morgan('combined'));
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
app.use('/feed', function(req, res) {res.sendFile(path.join(__dirname + '/frontend/feed.html'))})
app.use('/newSubmission', function(req, res) {res.sendFile(path.join(__dirname + '/frontend/newSubmission.html'))})
app.use('/submission', function(req, res) {res.sendFile(path.join(__dirname + '/frontend/submission.html'))})
app.use('/profile', function(req, res) {res.sendFile(path.join(__dirname + '/frontend/personaldata.html'))})
const db = require("./models/index");
sequelize.sync({
	alter: true,
	force: true
})

module.exports = app;