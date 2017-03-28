$(document).ready(function() {
    var socket = io();


    $('#subscriber_1').click(function(evn) {
        evn.preventDefault();

        /**
            When this button is clicked, server_subscriber_1 event is called on server.js. This event creates a connection
            to rabbitmq for routing key Service1.
        */
        socket.emit('server_subscriber_1');

        return false;
    })

    $('#subscriber_2').click(function(evn) {
        evn.preventDefault();

        /**
            When this button is clicked, server_subscriber_2 event is called on server.js. This event creates a connection
            to rabbitmq for routing key Service1.
        */

        socket.emit('server_subscriber_2');

        return false;
    });

    socket.on('client_subscriber_1', function(msg) {
        $('#service_messages_1').append($('<p>' + msg + '</p>'));
    });

    socket.on('client_subscriber_2', function(msg) {
        $('#service_messages_2').append($('<p>' + msg + '</p>'));
    });
});
