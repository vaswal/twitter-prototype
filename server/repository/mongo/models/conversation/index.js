const Schema = require('mongoose').Schema;

const conversationSchema = new Schema({
	channel: {
		type: String,
		unique: true,
		required: true,

	},
	messages: [
		{
			sender: String,
			message: String
		}
	],
	senderId: { type: Number },
	receiverId: { type: Number },
}, {
	timestamps: true
});

module.exports = conversationSchema;

