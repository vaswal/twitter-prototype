const chatService = require('../../service/conversation');


module.exports.getByChannel = function (request, response) {
    if (!(request.params && request.params.channel)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return chatService.getByChannel(request.params.channel, function (err, res) {
        if (err) return response.status(err.code ? err.code : 500).send(err);
        return response.send({
            status: "ok",
            data: res
        });
    });
}


module.exports.getByUser = function (request, response) {
    if (!(request.params && request.params.userId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return chatService.getByUser(request.params.userId, function (err, res) {
        if (err) return response.status(err.code ? err.code : 500).send(err);
        return response.send({
            status: "ok",
            data: res
        });
    });
}