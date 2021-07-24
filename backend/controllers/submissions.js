const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const submission = require('../models/submission');
const Submission = db.submissions;
const Op = db.Sequelize.Op

const fs = require('fs');

exports.createSubmission = (req, res, next) => {
  req.body.submission = JSON.parse(req.body.submission);
  const url = req.protocol + '://' + req.get('host');
  const submission = new Submission({
    title: req.body.submission.title,
    submissionText: req.body.submission.submissionText,
    imageUrl: url + '/images/' + req.file.filename,
    author: req.body.submission.pseudo,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
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
    Submission.findOne({
      _id: req.params.id
    }).then(
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
    let submission = new Submission({ _id: req.params._id });
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      req.body.submission = JSON.parse(req.body.submission);
      submission = {
        _id: req.params.id,
        title: req.body.submission.title,
        submissionText: req.body.submission.submissionText,
        imageUrl: url + '/images/' + req.file.filename,
        author: req.body.submission.pseudo,
      };
    } else {
      submission = {
        _id: req.params.id,
        title: req.body.title,
        submissionText: req.body.submissionText,
        userId: req.body.userId,
      };
    }
    Submission.updateOne({_id: req.params.id}, submission).then(
      () => {
        res.status(201).json({
          message: 'Submission updated successfully!'
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
  
exports.deleteSubmission = (req, res, next) => {
    Submission.findOne({_id: req.params.id}).then(
      (submission) => {
        const filename = submission.imageUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
          Submission.deleteOne({_id: req.params.id}).then(
            () => {
              res.status(200).json({
                message: 'Deleted!'
              });
            }
          ).catch(
            (error) => {
              res.status(400).json({
                error: error
              });
            }
          );
        });
      }
    );
  };
 
  exports.getAllSubmissions = (req, res, next) => {
    Submission.findAll({
      order: [sequelize.fn(sequelize.col('lastActivity'), 'DESC')],
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
  