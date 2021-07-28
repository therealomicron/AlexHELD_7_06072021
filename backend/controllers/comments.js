const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Submission = db.submissions;
const submission = require('../models/submission');
const User = db.users;
const user = require('../models/user');
const Comment = db.comments;
const comment = require('../models/comment');
const Op = db.Sequelize.Op

const fs = require('fs');

let adminPowers = async function(req, res) {
  let response = await User.findOne({where: {pseudo: req.body.pseudo}}
  ).then(
    queryResult => {
      console.log("isAdmin: " + queryResult.isAdmin);
      return queryResult.isAdmin;
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  );
}

exports.createComment = (req, res, next) => {
  const comment = new Comment({
    submissionId: req.body.submissionId,
    commentText: req.body.comment.commentText,
    author: req.body.comment.pseudo
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
  console.log("modifyComment called");
  const id = req.params.id;
  console.log(id);
  console.log(req.body);
  Comment.update({
    commentText: req.body.comment.commentText
  }, {
    where: { id: id }
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
}                                                                                                                             
  
exports.deleteComment = (req, res, next) => {
  console.log("deleteComment called")
  User.findOne({pseudo: req.body.pseudo}).then(
    (record) => {
      admin = record.isAdmin;
      console.log(admin);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      })
      return;
    }
  ); 
  Comment.findOne({_id: req.params.id}).then(
    (comment) => {
      console.log(comment.author);
      console.log(req.body.pseudo);
      console.log(req.body);
      console.log(req.params.id);
      if (admin == 1 || req.body.pseudo == comment.author) {
        const filename = comment.image.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
          Comment.destroy({where: {id: req.params.id} }).then(
            (num) => {
              if (num == 1) {
              res.status(200).json({
                message: 'Deleted!'
              });
              } else {
                res.send({
                  message: "The entry was not deleted. Perhaps entry " + req.params.id + " was not found."
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
        });
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
  console.log("calling getAllComments");
  console.log(req.params.id);
  Comment.findAll({
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
