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
		submissionText: {
			type: Sequelize.STRING,
			allowNull: true,
			unique: false
		},
		image: {
			type: Sequelize.STRING,
			allowNull: true,
			unique: false
		},
		likes: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		lastActivity: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		}
	});

return Submission;
};