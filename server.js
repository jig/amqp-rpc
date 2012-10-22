// http://stackoverflow.com/questions/10524613/how-to-create-rep-req-on-rabbit-js

//super simple rpc server example
var amqp = require('amqp')
  , util = require('util');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
  console.log("listening on msg_queue");
  cnn.queue('msg_queue', function(q){
      q.subscribe(function(message, headers, deliveryInfo, m){
        util.log(util.format( deliveryInfo.routingKey, message));
        //return index sent
        cnn.publish(m.replyTo, {response:"OK", index:message.index}, {
            contentType:'application/json',
            contentEncoding:'utf-8',
            correlationId:m.correlationId
          });
      });
  });
});