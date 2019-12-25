var connection = new require('../kafka/connection');
const routes = require('./routes');


function handleTopicRequest(topic_name) {
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name);
        console.log(JSON.stringify(message.value));
        try { var data = JSON.parse(message.value); }
        catch (err) {
            console.log(err);
            return;
        }

        routes[topic_name][data.data.task](data.data.payload, function (err, res) {
            console.log(res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res,
                        err: err
                    }),
                    partition: data.partition?data.partition:0
                }
            ];
            try {
                console.log(data);
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
            } catch (err) {
                console.log(err);
            }
            return;
        });

    });
}

handleTopicRequest('users');
handleTopicRequest('tweet');