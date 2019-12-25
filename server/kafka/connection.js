var kafka = require('kafka-node');

function ConnectionProvider() {
    this.getConsumer = function(topic_name) {

            this.client = new kafka.Client(process.env.KAFKA_HOST + ":2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { 
                topic: topic_name, 
                partition: process.env.KFP_CONSUMER? Number(process.env.KFP_CONSUMER):0}]);
            this.client.on('ready', function () { console.log('client ready!') })
        return this.kafkaConsumerConnection;
    };

    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client(process.env.KAFKA_HOST + ":2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;