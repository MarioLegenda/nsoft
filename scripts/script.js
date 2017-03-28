$(document).ready(function() {
    var socket = io();

    $('#subscriber_1').click(function(evn) {
        evn.preventDefault();

        socket.emit('subscriber 1', 'Message from subscriber 1');

        return false;
    })

    $('#subscriber_2').click(function(evn) {
        evn.preventDefault();

        socket.emit('subscriber 2', 'Message from subscriber 2');

        return false;
    })
});
