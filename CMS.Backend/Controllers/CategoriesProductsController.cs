using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thay bằng namespace Data chuẩn trong đồ án của em

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // Thay bằng DbContext của em

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoriesProducts
        [HttpGet]
        public async Task<IActionResult> GetCategoriesProducts()
        {
            // Lấy toàn bộ danh sách danh mục sản phẩm từ Database
            var list = await _context.CategoriesProducts
                                     .Select(c => new {
                                         Id = c.Id,
                                         Name = c.Name
                                     })
                                     .ToListAsync();
            return Ok(list);
        }
    }
}