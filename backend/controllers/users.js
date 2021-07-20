const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const User = db.users;
const Op = db.Sequelize.Op;

exports.signup = (req, res, next) => {
  console.log("Signup controller called");
  console.log(req.query.hashedPassword);
  bcrypt.hash(req.query.hashedPassword, 10).then(
    (hash) => {
      const user = new User({
        pseudo: req.query.pseudo,
        hashedPassword: hash,
        isAdmin: 0
      });
      user.save().then(
        () => {
          res.status(201).json({
            message: 'User added successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    }
  );
};

exports.login = (req, res, next) => {
    User.findOne({ pseudo: req.query.pseudo }).then(
      (user) => {
        if (!user) {
          return res.status(401).json({
            error: new Error('User not found!')
          });
        }
        bcrypt.compare(req.query.hashedPassword, user.hashedPassword).then(
          (valid) => {
            if (!valid) {
              return res.status(401).json({
                error: new Error('Incorrect password!')
              });
            }
            const token = jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' });
            res.status(200).json({
              userId: user._id,
              token: token
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({
              error: error
            });
          }
        );
      }
    ).catch(
      (error) => {
        res.status(500).json({
          error: error
        });
      }
    );
}