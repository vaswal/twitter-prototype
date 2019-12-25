var rpc = new (require('./kafkarpc'))();
const cache = require('../cache');
//make request to kafka
function make_request(queue_name, msg_payload, callback){
    console.log('in make request');
    console.log(msg_payload);
	rpc.makeRequest(queue_name, msg_payload, function(err, response){

		if(err){
            console.error(err);
            callback(err);
         }   
		else{
			console.log("response", response);
			callback(null, response);
		}
	});
}

function request_delegator(topic, task){
    return (function(request, response){
        
        const payload = {
            task,
            payload:{
                params:request.params,
                body:request.body,
                query:request.query,
                user:request.user?request.user:undefined
            }
        };

        cache.get(`${topic}=>${JSON.stringify(payload)}`, function(err, cacheData){
            console.log("Found data in Cache >>>>  data: " + cacheData);
            if(cacheData){
                return response.send({
                    status: "ok",
                    data: JSON.parse(cacheData)
                });
            } else {
                console.log("Making Kafka Request >>>>  Topic: " + topic + "     Task: " + task);
                return make_request(topic, payload, function(err, data){
                    if(err) return response.status(err.code ? err.code : 500).send(err);

                    cache.set(`${topic}=>${JSON.stringify(payload)}`, JSON.stringify(data), function(err){
                        if(err){
                            console.log("Write to Cache Failed >>>> err: " + JSON.stringify(err, null, 4));
                        } else {
                            cache.expire(`${topic}=>${JSON.stringify(payload)}`, process.env.CACHE_EXPIRY_TIME);
                        }
                    })
        
                    return response.send({
                        status: "ok",
                        data: data
                    });
                });
            }
        })
        
    })
}

module.exports = {
	make_request,
	request_delegator
}
