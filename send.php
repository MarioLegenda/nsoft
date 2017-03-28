<?php

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$channel = $connection->channel();

$channel->exchange_declare('service_exchange', 'direct', false, false, false);

$messages = array(
    'Service 1 publishing messages every 5s',
    'Service 2 publishing messages every 5s',
);

for (;;) {
    $channel->basic_publish(new AMQPMessage($messages[0]), 'service_exchange', 'Service1');
    $channel->basic_publish(new AMQPMessage($messages[1]), 'service_exchange', 'Service2');

    sleep(5);
}

$channel->close();
$connection->close();
