module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define("like", {
		likeId: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		submissionId: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: false 
		},
        pseudo: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        },
		likeValue: {
			type: Sequelize.INTEGER,
			allowNull: false,
			unique: false
		}
	});

return Like;
};