window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://192.168.0.101:5000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i = 0; i < messages.length; i++) {
                if( messages[i].username ) {
                    if( messages[i].username == name.value ) {
                        // html += '<span class="label label-success">' + messages[i].username + '</span> ';
                        html += '<div class="alert alert-success"><strong>' + messages[i].username + ':</strong> ';
                    } else {
                        // html += '<span class="label label-info">' + messages[i].username + '</span> ';
                        html += '<div class="alert alert-info"><strong>' + messages[i].username + ':</strong> ';
                    }
                } else {
                    // html += '<span class="label">Server</span> ';
                    html += '<div class="alert"><strong>Server:</strong> ';
                }
                // html += '<span class="label">' + (messages[i].username ? messages[i].username : 'Server') + ':</span> ';
                // html += messages[i].message + '<br>';
                html += messages[i].message + '</div>';
            }
            content.innerHTML = html;
            // content.scrollTop = content.scrollHeight;
            $('#content').scrollTop($('#content')[0].scrollHeight);
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = sendMessage = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
            field.value = '';
        }
    };
 
}

$(document).ready(function () {
    $('#field').keyup(function (e) {
        if(e.keyCode == 13) {
            sendMessage();
        }
    });
});