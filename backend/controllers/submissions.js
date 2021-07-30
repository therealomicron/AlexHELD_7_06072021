const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const submission = require('../models/submission');
const Submission = db.submissions;
const User = db.users;
const Op = db.Sequelize.Op
const tokenizer = require('./common');
const Comment = db.comments;
const comment = require('../models/comment');
const like = require('../models/like');
const Like = db.likes;

const fs = require('fs');
const user = require('../models/user');

exports.createSubmission = (req, res, next) => {
  const uId = jwt.verify(req.headers.authorization.split(' ')[1], 'RANDOM_TOKEN_SECRET').userId;
  const url = req.protocol + '://' + req.get('host');
  const submission = new Submission({
    title: req.body.submission.title,
    submissionText: req.body.submission.text,
    image: './assets/images/' + req.file.filename,
    author: uId 
  });
  submission.save().then(
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

exports.getOneSubmission = (req, res, next) => {
  const id = req.params.id;
  Submission.findByPk(id)
    .then(
      (submission) => {
        res.status(200).json(submission);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};

exports.modifySubmission = (req, res, next) => {
  console.log("modifySubmission called");
  const id = req.params.id;
  console.log(id);
  console.log(req.body);
  Submission.update({
    submissionText: req.body.submission.text
  }, {
    where: { id: id }
  })
  .then( () => {
      res.status(201).json({
        message: 'Submission updated successfully!'
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
  
exports.deleteSubmission = (req, res, next) => {
  const admin = tokenizer.decodedToken(req, res).isAdmin;
  const uId = tokenizer.decodedToken(req, res).pseudo;
  Submission.findOne({_id: req.params.id}).then(
    (submission) => {
      if (admin == true || uId == submission.author) {
        Comment.destroy({where: {submissionId: req.params.id}}).then(
          result => {
            console.log("All comments of submission " + req.params.id + " have been deleted.")
          }
        ).catch(
          error => {
            console.log(error)
          }
        );
        Like.destroy({where: {submissionId: req.params.id}}).then(
          result => {
            console.log("All likes of submission " + req.params.id + " have been deleted.")
          }
        ).catch(
          error => {
            console.log(error)
          }
        );
        const filename = submission.image.split('/frontend/assets/images/')[1];
        fs.unlink('frontend/assets/images/' + filename, () => {
          Submission.destroy({where: {id: req.params.id} }).then(
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
        res.status(401).json({
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
 
exports.getAllSubmissions = (req, res, next) => {
  console.log("calling getAllSubmissions");
  console.log(req.params.id);
  Submission.findAll({
    order:[ ['lastActivity', 'DESC'] ],
    limit: 10
  }).then(
    (submissions) => {
      res.status(200).json(submissions);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
