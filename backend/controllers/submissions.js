const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const submission = require('../models/submission');
const Submission = db.submissions;
const Op = db.Sequelize.Op

const fs = require('fs');

exports.createSubmission = (req, res, next) => {
  //req.body.submission = JSON.parse(req.body.submission);
  console.log("createSubmission called");
  console.log(req.body);
  const url = req.protocol + '://' + req.get('host');
  const submission = new Submission({
    title: req.body.submission.title,
    submissionText: req.body.submission.submissionText,
    image: url + '/images/' + req.file.filename,
    author: req.body.submission.pseudo
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
  console.log("calling getOneSubmission");
  console.log(req.params);
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
    submissionText: req.body.submission.submissionText
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
  