var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var amqp = require('amqplib/callback_api');

app.use(express.static("static", {maxage : 0}));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/scripts'));

app.get('/', function(req, res) {
  var indexPath = path.resolve(__dirname + '/public/index.html')
  res.sendFile(indexPath);
});

io.on('connection', function(socket) {
  socket.on('server_subscriber_1', function(msg) {
      /*
          This event is handled when server_subscriber_1 event is dispatched from the client. It connects to Rabbitmq and
          listens only to messages on queues connected with Service1 routing key.
      */
      amqp.connect('amqp://localhost', function(err, conn) {
          conn.createChannel(function(err, ch) {
              var exchange = 'service_exchange';

               ch.assertExchange(exchange, 'direct', {durable: false});

               ch.assertQueue('', {exclusive: true}, function(err, q) {
                   ch.bindQueue(q.queue, exchange, 'Service1');

                   ch.consume(q.queue, function(msg) {
                       io.emit('client_subscriber_1', msg.content.toString());
                   }, {noAck: true});
               });
          });
      });
  });

  socket.on('server_subscriber_2', function(msg) {
      /*
          This event is handled when server_subscriber_2 event is dispatched from the client. It connects to Rabbitmq and
          listens only to messages on queues connected with Service2 routing key.
      */
      amqp.connect('amqp://localhost', function(err, conn) {
          conn.createChannel(function(err, ch) {
              var exchange = 'service_exchange';

               ch.assertExchange(exchange, 'direct', {durable: false});

               ch.assertQueue('', {exclusive: true}, function(err, q) {
                   var services = ['Service1', 'Service2'],
                       i;

                   for (i = 0; i < services.length; i++) {
                       ch.bindQueue(q.queue, exchange, services[i]);
                   }

                   ch.consume(q.queue, function(msg) {
                       io.emit('client_subscriber_2', msg.content.toString());
                   }, {noAck: true});
               });
          });
      });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
