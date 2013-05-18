var windowFocus = true;
var notificationSoundOn = true;

window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://' + document.location.host );
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var notificationSound = document.getElementById('notification-sound');
 
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
            // -- Muestro una notificacion
            if( !windowFocus && data.username && data.username != name.value ) {
                showNotification((data.username ? data.username + ' dice:' : 'Server dice:'), data.message, null);
                if( notificationSoundOn ) notificationSound.play();
            }
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

    window.onfocus = function() { windowFocus = true; }
    window.onblur = function() { windowFocus = false; }
 
}

function setNotificaionPermissions() {
    if(window.webkitNotifications) {
        window.webkitNotifications.requestPermission();
    } else {
        alert('Tu navegador no soporta notificaciones');
    }
}

function showNotification(title, msg, icon) {
    if(window.webkitNotifications) {
        var wkn = window.webkitNotifications;
        var notif;
        if(wkn.checkPermission() == 0) {
            notif = wkn.createNotification(icon, title, msg);
            notif.onclick = function(x) { window.focus(); field.focus(); this.cancel(); }
            notif.show();
        }
    }
}

$(document).ready(function () {
    // -- Detected press key enter to send message
    $('#field').keyup(function (e) {
        if(e.keyCode == 13) {
            sendMessage();
        }
    });

    // -- Autorize chrome notification
    $('#notification').click(function (e) {
        setNotificaionPermissions();
    });

    // -- Audio notification on/off
    $('#notification-sound-toggle').change(function (e) {
        // console.log( $(this).prop('checked') );
        notificationSoundOn = $(this).prop('checked');
    });

    // -- Detect el soporte de chrome notification
    if( !window.webkitNotifications ) {
        $('#notification').hide();
    }

    // -- Detectar el soporte de audio/mp3
    var a = document.createElement('audio');
    if( !( a.canPlayType && a.canPlayType('audio/mpeg').replace(/no/,'') ) ) {
        notificationSoundOn = false;
        $('.checkbox').hide();
    }
});