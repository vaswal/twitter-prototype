
var redis_endpoint = process.env.REDIS_URL
var redis_port = process.env.REDIS_PORT

var redis = require("redis");
var client = redis.createClient({
	host: redis_endpoint,
	port: redis_port
});

client.on("error", function (err) {
	console.log(err);
});

module.exports = client
