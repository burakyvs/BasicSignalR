﻿"use strict";


var connection = new signalR.HubConnectionBuilder()
    .withUrl("/messageroom/messages")
    .build();

connection.on("ReceiveAllMessages", function(message){
        console.log("aha for, ", message);
        const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var div = document.createElement("div");
        div.innerHTML = msg + "<hr/>";
        document.getElementById("messages").appendChild(div);
});


connection.on("ReceiveMessage", function(message){
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.innerHTML = msg + "<hr/>";
    document.getElementById("messages").appendChild(div);
});

connection.start().then(() => connection.invoke("GetAllMessages").catch(function(err) {
    return console.error(err.toString());
})).catch(function(err) {
return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function(event){
    var message = document.getElementById("message").value;
    document.getElementById("message").value = "";
    connection.invoke("SendMessageToAll", message).catch(function(err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
