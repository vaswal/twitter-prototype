module.exports = function (sequelize, DataTypes) {
	return sequelize.define('lists', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		data: {
	        type: DataTypes.JSON,
	        allowNull: true
	    }
	});
};