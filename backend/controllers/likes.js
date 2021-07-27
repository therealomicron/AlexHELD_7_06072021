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

const fs = require('fs');

exports.createLike = (req, res, next) => {
  const like = new Like({
    likeId: req.body.submissionId + req.body.pseudo,
    submissionId: req.body.submissionId,
    pseudo: req.body.pseudo,
    likeValue: req.body.likeValue
  });

  like.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
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
  console.log(req.params.id);
  Like.findAll({
    where: {}
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
