const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const submission = require('../models/submission');
const Submission = db.submissions;
const User = db.users;
const Op = db.Sequelize.Op
const tokenizer = require('./common');

const fs = require('fs');
const user = require('../models/user');

exports.createSubmission = (req, res, next) => {
  const uId = jwt.verify(req.headers.authorization.split(' ')[1], 'RANDOM_TOKEN_SECRET').userId;
  const url = req.protocol + '://' + req.get('host');
  const submission = new Submission({
    title: req.body.submission.title,
    submissionText: req.body.submission.text,
    image: url + '/images/' + req.file.filename,
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
  let admin;
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
  Submission.findOne({_id: req.params.id}).then(
    (submission) => {
      console.log(submission.author);
      console.log(req.body.pseudo);
      console.log(req.body);
      console.log(req.params.id);
      if (admin == 1 || req.body.pseudo == submission.author) {
        const filename = submission.image.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
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
 
exports.getAllSubmissions = (req, res, next) => {
  console.log("calling getAllSubmissions");
  console.log(req.params.id);
  Submission.findAll({
    //order: [sequelize.fn(sequelize.col('lastActivity'), 'DESC')],
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
