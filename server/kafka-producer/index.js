const request_delegator = require('../kafka/client').request_delegator;
const config = require('./config');

const producer = {};

Object.keys(config).map(handle => {
    const routes = Object.keys(require(config[handle].PATH));
    producer[handle] = {};
    routes.map(route => {
        producer[handle][route] = request_delegator(config[handle].TOPIC, route);
    });
})

module.exports = producer;

