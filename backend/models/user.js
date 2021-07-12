module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define("user", {
			pseudo: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	hashedPassword: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: false
	},
	isAdmin: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		unique: false
	}
});

return User;
};