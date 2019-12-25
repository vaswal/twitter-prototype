module.exports = function (sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		firstName: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		lastName: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		username: {
			type: DataTypes.STRING(500),
			allowNull: false,
			validate: {
				notEmpty: true,

			},
			unique: true
		},
		email: {
			type: DataTypes.STRING(500),
			allowNull: false,
			validate: {
				notEmpty: true,

			},
			unique: true
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		data: {
	        type: DataTypes.JSON,
	        allowNull: true
	    }
	});
};