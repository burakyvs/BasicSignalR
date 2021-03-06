"use strict";


var connection = new signalR.HubConnectionBuilder()
    .withUrl("/messageroom/messages")
    .build();

connection.on("ReceiveAllMessages", function(userName, message, finished){
        console.log("aha for, ", message);
        const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var div = document.createElement("div");
        div.innerHTML = userName + ": " + msg;
        document.getElementById("messages").appendChild(div);
        if(finished){
            div.innerHTML = "<p style='color:red'><b>---------------------- Joined ----------------------</b></p>";
            document.getElementById("messages").appendChild(div);
        }
});
connection

connection.on("ReceiveMessage", function(userName, message){
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.innerHTML = userName + ": " + msg ;
    document.getElementById("messages").appendChild(div);
});

connection.start()
    .then(() => connection.invoke("GetAllMessages").catch(function(err) {
        return console.error(err.toString());
    }))
    .catch(function(err) {
        return console.error(err.toString());
    });

document.getElementById("sendButton").addEventListener("click", function(event){
    var message = document.getElementById("message").value;
    var userName = document.getElementById("userName").value;
    if(message != ""){
        document.getElementById("message").value = "";
        connection.invoke("SendMessageToAll", userName, message).catch(function(err) {
            return console.error(err.toString());
        });
    }
    event.preventDefault();
});
