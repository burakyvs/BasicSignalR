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
        private static IDictionary<string, string> clients = new Dictionary<string, string>();
        public Task SendMessageToAll(string userName, string message)
        {
            AllMessages.Add(Tuple.Create(userName, message));
            return Clients.All.SendAsync("ReceiveMessage", userName, message);
        }

        public override async Task OnDisconnectedAsync(Exception ex){
            await base.OnDisconnectedAsync(ex);
        }

        public IEnumerable<Task> GetAllMessages(){
            foreach(var message in AllMessages){
                yield return Clients.Caller.SendAsync("ReceiveAllMessages", message.Item1, message.Item2);
            }
        }
    }
}
