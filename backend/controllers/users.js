const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const User = db.users;
const Op = db.Sequelize.Op;

exports.signup = (req, res, next) => {
  console.log("Signup controller called");
  console.log(req.body);
  bcrypt.hash(req.body.hashedPassword, 10).then(
    (hash) => {
      const user = new User({
        pseudo: req.body.pseudo,
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
  console.log("login controller called");
  console.log(req.body);
    User.findOne({ where: {
      pseudo: req.body.pseudo }
    }).then(
      (user) => {
        if (!user) {
          return res.status(401).json({
            error: new Error('User not found!')
          });
        }
        bcrypt.compare(req.body.hashedPassword, user.hashedPassword).then(
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
            console.log(error);
            res.status(500).json({
              error: error
            });
          }
        );
      }
    ).catch(
      (error) => {
        console.log(error);
        res.status(500).json({
          error: error
        });
      }
    );
}

//deletes an account
exports.suppression = (req, res, next) => {
 console.log("User suppression controller called");
 console.log(req.body);
 User.findOne({
   where: {
     pseudo: req.body.pseudo
   }
 }).then(
   (user) => {
     if (!user) {
       return res.status(401).json({
         error: new Error('Le pseudo est introuvable.')
       });
     }
     bcrypt.compare(req.body.hashedPassword, user.hashedPassword).then(
       (valid) => {
         if(!valid) {
           return res.status(401).json({
             error: new Error('Faux mot de passe.')
           });
         }
         User.destroy({
           where: {
             pseudo: req.body.pseudo
           },
           truncate: false
         })
         .then(
           res.send({message: req.body.pseudo + " supprimé avec succès."})
         )
         .catch(err => {
           res.status(500).send({
             message: 
              err.message ||  "Une erreur inconnue est survenue pendant la suppression de votre compte."
           })
         })
       }
     )
   }
 ).catch( (error) => {
   console.log(error);
   res.status(500).json({
     error: error
   });
 }); 
}