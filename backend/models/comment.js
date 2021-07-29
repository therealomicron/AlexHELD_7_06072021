module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define("comment", {
		submissionId: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: false 
		},
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
		commentText: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: false
		}
	});

return Comment;
};