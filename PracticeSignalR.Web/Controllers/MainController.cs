using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PracticeSignalR.Web.Hubs;

namespace PracticeSignalR.Web{
    public class MainController : Controller
    {
        private readonly IHubContext<MessageHub> hubContext;
        

        public MainController(IHubContext<MessageHub> hubContext)
        {
            this.hubContext = hubContext;
        }
        public IActionResult Index(){
            return View();
        }

        [HttpPost("/messageroom")]
        public IActionResult MessageRoom(string userName){   
            return View("MessageRoom", userName);
        }
    }
}