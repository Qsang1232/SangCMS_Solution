/*
 *Ho va ten :Nguy?n Qu?c Sang
 *Msvv:2123110076
 *Ngay tao:14/5/2026 
 *version 1.0
 */


using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
