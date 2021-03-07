"use strict";


var connection = new signalR.HubConnectionBuilder()
    .withUrl("/messageroom/messages")
    .build();

connection.on("ReceiveAllMessages", function(userName, message, finished){
        const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var div = document.createElement("div");
        div.innerHTML = userName + ": " + msg;
        document.getElementById("messages").appendChild(div);
        if(finished){
            div.innerHTML = "<p style='color:red'><b>---------------------- Joined ----------------------</b></p>";
            document.getElementById("messages").appendChild(div);
        }
});

connection.on("ReceiveMessage", function(senderUserName, receiverUserName, message, isPrivate){
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("div");
    if(!isPrivate){
        div.innerHTML = senderUserName + ": " + msg ;
    }else{
        if(receiverUserName == ""){
            div.innerHTML = senderUserName + " (<span style='color:blue;'>selfmsg</span>): " + msg ;
        }else{
            div.innerHTML = senderUserName + " to (<span style='color:red;'>" + receiverUserName + "</span>): " + msg ;
        }
        
    }
    
    document.getElementById("messages").appendChild(div);
});

connection.on("GetConnectedUser", function(connectionId, userName){
        var option = document.createElement("option");
        option.innerHTML = userName;
        option.value = connectionId;
        var sendToSelect = document.getElementById("sendToSelect");
        var searchOptionWithId = document.getElementById(connectionId);
        if(searchOptionWithId == null)
            sendToSelect.appendChild(option);
});

connection.on("GetAllConnectedUsers", function(connectionId, userName){
    var option = document.createElement("option");
    option.innerHTML = userName;
    option.value = connectionId;
    document.getElementById("sendToSelect").appendChild(option);
});

connection.on("GetDisconnectedUsers", function(connectionId){
    var sendToSelect = document.getElementById("sendToSelect");
    for(var i = 0; i < sendToSelect.length; i++){
        if(sendToSelect.options[i].value == connectionId)
            sendToSelect.remove(i);
    }
})

connection.start()
    .then(() => connection.invoke("GetAllMessages").catch(function(err) {
        return console.error(err.toString());
    }))
    .then(() => connection.invoke("GetAllUsers").catch(function(err){
        return console.error(err.toString());
    }))
    .then(() => connection.invoke("UserConnected", document.getElementById("userName").value).catch(function(err){
        return console.error(err.toString());
    }))
    .then(() => connection.invoke("GetCallerConnectionId").then(function(connectionId){ console.log(connectionId);}).catch(function(err) {
        return console.error(err.toString());
    }))
    .catch(function(err) {
        return console.error(err.toString());
    });

document.getElementById("sendButton").addEventListener("click", function(event){
    var message = document.getElementById("message").value;
    var senderUserName = document.getElementById("userName").value;
    if(message != ""){
        document.getElementById("message").value = "";
        var sendToSelect = document.getElementById("sendToSelect");
        var sendToWhoId = sendToSelect.options[sendToSelect.selectedIndex].value;
        var sendToWhoUserName = sendToSelect.options[sendToSelect.selectedIndex].innerHTML;
        if(sendToWhoId == ""){
            connection.invoke("SendMessageToAll", senderUserName, message).catch(function(err) {
                return console.error(err.toString());
            });
        }else{
            connection.invoke("SendMessageToClient", sendToWhoId, senderUserName, sendToWhoUserName, message).catch(function(err){
                return console.error(err.toString());
            });
            connection.invoke("SendMessageToCaller", senderUserName, sendToWhoUserName, message).catch(function(err){
                return console.error(err.toString());
            });
        }
        
    }
    event.preventDefault();
});
