module.exports = (sequelize, Sequelize) => {
	const Submission = sequelize.define("submission", {
		title: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: false 
		},
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
		contents: {
			type: Sequelize.STRING,
			allowNull: true,
			unique: false
		},
		image: {
			type: Sequelize.STRING,
			allowNull: true,
			unique: false
		}
	});

return Submission;
};