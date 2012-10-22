// http://stackoverflow.com/questions/10524613/how-to-create-rep-req-on-rabbit-js

//exmaple on how to use amqprpc
var amqp = require('amqp');
var connection = amqp.createConnection({host:'127.0.0.1'});

var rpc = new (require('./amqprpc'))(connection);

connection.on("ready", function(){
  console.log("ready");
  var outstanding=0; //counter of outstanding requests

  //do a number of requests
  for(var i=1; i<=10 ;i+=1){
    //we are about to make a request, increase counter
    outstanding += 1;
    rpc.makeRequest('msg_queue', {foo:'bar', index:outstanding}, function response(err, response){
      if(err)
        console.error(err);
      else
        console.log("response", response);
      //reduce for each timeout or response
      outstanding-=1;
      isAllDone();
    });
  }

  function isAllDone() {
    //if no more outstanding then close connection
    if(outstanding === 0){
      connection.end();
    }
  }

});