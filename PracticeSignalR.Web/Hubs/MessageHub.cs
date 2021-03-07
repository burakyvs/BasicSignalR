using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PracticeSignalR.Web.Hubs
{
    public class MessageHub : Hub
    {
        public static List<Tuple<string, string>> AllMessages = new List<Tuple<string, string>>();
        public static List<Tuple<string, string>> ClientUserNames = new List<Tuple<string, string>>();
        public Task SendMessageToAll(string senderUserName, string message)
        {
            AllMessages.Add(Tuple.Create(senderUserName, message));
            return Clients.All.SendAsync("ReceiveMessage", senderUserName, "", message, false);
        }

        public Task SendMessageToClient(string receiverConnectionId, string senderUserName, string receiverUserName, string message){
            if(receiverConnectionId != Context.ConnectionId)
                return Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderUserName, receiverUserName, message, true);
            return Task.FromResult(0);
        }
        public Task SendMessageToCaller(string senderUserName, string receiverUserName, string message){
            if(receiverUserName == senderUserName)
                return Clients.Caller.SendAsync("ReceiveMessage", senderUserName, "", message, true);
            else
                return Clients.Caller.SendAsync("ReceiveMessage", senderUserName, receiverUserName, message, true);
        }

        /*public override async Task OnConnectedAsync(){
            await base.OnConnectedAsync();
        }*/

        public override async Task OnDisconnectedAsync(Exception ex){
            foreach(var client in ClientUserNames){
                if(client.Item1 == Context.ConnectionId){
                    ClientUserNames.Remove(client);
                    break;  
                }        
            }
            await Clients.All.SendAsync("GetDisconnectedUsers", Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }

        public Task UserConnected(string userName){
            ClientUserNames.Add(Tuple.Create(Context.ConnectionId, userName));
            return Clients.All.SendAsync("GetConnectedUser", Context.ConnectionId, userName);
        }

        public Task GetCallerConnectionId(){
            return Clients.Caller.SendAsync("GetCallerConnectionId", Context.ConnectionId);
        }

        

        public IEnumerable<Task> GetAllUsers(){
            foreach(var client in ClientUserNames){
                yield return Clients.Caller.SendAsync("GetAllConnectedUsers", client.Item1, client.Item2);
            }
        }
        public IEnumerable<Task> GetAllMessages(){
           foreach(var message in AllMessages){
                if(AllMessages.Last() == message){
                    yield return Clients.Caller.SendAsync("ReceiveAllMessages", message.Item1, message.Item2, true);
                    break;
                }
                    
                yield return Clients.Caller.SendAsync("ReceiveAllMessages", message.Item1, message.Item2, false);
            }
        }
    }
}
