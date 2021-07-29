const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Submission = db.submissions;
const submission = require('../models/submission');
const User = db.users;
const user = require('../models/user');
const Comment = db.comments;
const comment = require('../models/comment');
const Op = db.Sequelize.Op;
const tokenizer = require('./common');

exports.createComment = (req, res, next) => {
  const comment = new Comment({
    submissionId: req.body.submissionId,
    commentText: req.body.commentText,
    author: tokenizer.decodedToken(req, res).pseudo 
  });
  comment.save().then(
    () => {
      res.status(201).json({
        message: 'Comment saved successfully!'
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


exports.modifyComment = (req, res, next) => {
  console.log("modifyComment called.")
  console.log(tokenizer.decodedToken(req, res));
  const commentId = req.body.commentId;
  const uId = tokenizer.decodedToken(req, res).pseudo;
  Comment.findOne({where: {id: commentId}}).then(queryResult => {
    if (uId == queryResult.author) {
      console.log("comment modification authorized.");
      Comment.update({
        commentText: req.body.commentText
      }, {
        where: { id: commentId }
      })
      .then( () => {
          res.status(201).json({
            message: 'Comment updated successfully!'
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
    } else {
      res.status(401).json({
        message: "Vous n'avez pas les permissions nécessaires."
      })
      return;
    }
  }).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
   );
}                                                                                                                             
  
exports.deleteComment = (req, res, next) => {
  console.log("deleteComment called")
  const uId = tokenizer.decodedToken(req, res).pseudo;
  const admin = tokenizer.decodedToken(req, res).isAdmin;
  Comment.findOne({id: req.body.commentId}).then(
    (comment) => {
      if (admin == true || uId == comment.author) {
          Comment.destroy({where: {id: req.body.commentId} }).then(
            (num) => {
              if (num == 1) {
              res.status(200).json({
                message: 'Supprimé !'
              });
              } else {
                res.send({
                  message: "The entry was not deleted. Perhaps entry " + req.params.id + " does not exist."
                })
              }
            }
          ).catch(
            (error) => {
              res.status(400).json({
                error: error
              });
            }
          );
        } else {
        res.status(500).json({
          message: "Vous n'avez pas les permissions nécessaires."
        })
      }
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  );
};
 
exports.getAllComments = (req, res, next) => {
  Comment.findAll({
    where: {submissionId: req.body.submissionId},
    //order: [sequelize.fn(sequelize.col('lastActivity'), 'DESC')],
    limit: 10
  }).then(
    (comments) => {
      res.status(200).json(comments);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
