const repository = require('../../repository/mongo');
//const User = require('../../repository/mysql').User;

module.exports.saveMessage = async (channel, message) => {

    console.log('chat service');
    let chat = {};
    try {
        chat = await repository.Conversation.findOne({ channel: channel });

        if (!chat) {
            const channelArr = channel.split('|');
            chat = { senderId: channelArr[0], receiverId: channelArr[1], channel: channel };

            chat = await repository.Conversation.create(chat);
        }
        console.log('message check', message);
        chat = await repository.Conversation.update({ _id: chat._id },
            { "$push": { "messages": message } }
        );
    } catch (e) { console.error(e); }
}

module.exports.getByChannel = function (channel, cb) {
    repository.Conversation.findOne(
        { channel: channel })
        .then(function (chat) {
            return cb(null, chat);

        }, function (err) {
            return cb(err);
        });
}

module.exports.getByUser = function (userId, cb) {
    repository.Conversation.find({
        "$or": [{ senderId: userId }, { receiverId: userId }]
    })
        .then(function (chats) {
            return cb(null, chats);

        }, function (err) {
            return cb(err);
        });
}

// module.exports.getByChannel = async (channel, cb) => {
//     try {
//         console.log('chat check, ', channel);
//         let chat = await repository.Conversation.findOne(
//             { channel: channel },
//         );

//         return cb(null, chat.messages);

//     } catch (error) {
//         console.log('error here', error);
//         return cb(error);
//     }
// }

// module.exports.getByUser = async (userId, cb) => {
//     try {
//         let chats = await repository.Conversation.find(
//             { senderId: userId }
//         );
//         console.log('chat list call chats = ', chats);
//         return cb(null, chats);
//     } catch (error) {
//         console.log('error here', error);
//         return cb(error);
//     }
// }