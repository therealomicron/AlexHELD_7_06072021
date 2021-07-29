const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const submission = require('../models/submission');
const Submission = db.submissions;
const user = require('../models/user');
const User = db.users;
const Op = db.Sequelize.Op
const like = require('../models/like');
const Like = db.likes;

exports.decodedToken = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;
  return {
      "pseudo": userId,
      "isAdmin": isAdmin
  }
};