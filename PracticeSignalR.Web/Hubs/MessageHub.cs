using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PracticeSignalR.Web.Hubs
{
    public class MessageHub : Hub
    {
        public static List<string> AllMessages = new List<string>();
        public Task SendMessageToAll(string message)
        {
            AllMessages.Add(message);
            return Clients.All.SendAsync("ReceiveMessage", message);
        }

        public IEnumerable<Task> GetAllMessages(){
            for(int i = 0; i < AllMessages.Count(); i++){
                yield return Clients.Caller.SendAsync("ReceiveAllMessages", AllMessages[i]);
            }
        }
    }
}
