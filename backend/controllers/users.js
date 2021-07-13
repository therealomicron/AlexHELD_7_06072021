const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;

exports.create(req, res) => {
    if (!req.body.title) {
        res.status(40).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const user = {
        pseudo: req.body.pseudo,
        hashedPassword: req.body.hashedPassword,
        isAdmin: 0
    };

    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "An error occurred while create the user."
            });
        });
};

exports.findAll = (req, res) => {

};

exports.findOne = (req, res) => {

};

exports.update = (req, res) => {

};

exports.delete = (req, res) => {

};

exports.deleteAll = (req, res) => {

};

exports.findAllPublished = (req, res) => {

};