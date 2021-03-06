using Microsoft.AspNetCore.Mvc;

namespace PracticeSignalR.Web{
    public class MainController : Controller
    {
        public MainController()
        {           
            
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