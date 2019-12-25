const Schema = require('mongoose').Schema;

const UserAnalytics = new Schema({
	ownerId: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
});

module.exports = UserAnalytics;
