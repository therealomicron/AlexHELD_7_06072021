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
const tokenizer = require('./common');

const fs = require('fs');

let likeExists = async function(req, res) {
  let response = await Like.findAndCountAll({where: {likeId: req.body.submissionId + tokenizer.decodedToken(req, res).pseudo}}
  ).then(
    queryResult => {
      console.log("queryResult.count: " + queryResult.count)
      return queryResult.count
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  );
  return response;
}

exports.likeSwitch = (req, res, next) => {
  console.log(tokenizer.decodedToken(req, res));
  likeExists(req, res).then(likeValue => {
    if (likeValue == 1) {
      Like.destroy({where: {likeId: req.body.submissionId + tokenizer.decodedToken(req, res).pseudo}}
        ).then((num) => {
          if (num == 1) {
            res.status(200).json({
              message: "unliked!"
            })
          } else {
            res.status(500).json({
              message: "ce like n'existe pas !"
            })
          }
        }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            })
          }
        )
    } else {
      console.log(tokenizer.decodedToken(req, res).pseudo);
      const like = new Like({
        likeId: req.body.submissionId + tokenizer.decodedToken(req, res).pseudo,
        submissionId: req.body.submissionId,
        pseudo: tokenizer.decodedToken(req, res).pseudo,
        likeValue: 1 
      });

      like.save().then(
        () => {
          res.status(201).json({
            message: 'Liked!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    }
  })
};


exports.modifyLike = (req, res, next) => {
  Like.update({
    likeValue: req.body.likeValue
  }, 
  {
    where: { id: req.body.submissionId + req.body.pseudo }
  })
  .then( () => {
      res.status(201).json({
        message: 'Like updated successfully!'
      });
    } 
  )
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
      }
  );
}                                                                                                                             
  
 
exports.getAllLikes = (req, res, next) => {
  console.log("calling getAllLikes");
  Like.findAll({
    where: {submissionId: req.body.submissionId}
  }).then(
    (likes) => {
      res.status(200).json(likes);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
