using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API LẤY DANH SÁCH TẤT CẢ SẢN PHẨM (GET: api/ProductsApi)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.OrderByDescending(p => p.Id).ToListAsync();
        }

        // 2. API LẤY CHI TIẾT MỘT SẢN PHẨM THEO ID (GET: api/ProductsApi/5)
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này!" });
            }

            return product;
        }

        // 3. API THÊM MỚI SẢN PHẨM (POST: api/ProductsApi)
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (product.StockQuantity == null || product.StockQuantity < 0)
            {
                product.StockQuantity = 0;
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // 4. API CHỈNH SỬA SẢN PHẨM (PUT: api/ProductsApi/5)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest(new { message = "ID sản phẩm không trùng khớp!" });
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Sản phẩm không tồn tại!" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Cập nhật sản phẩm thành công!" });
        }

        // 5. API XÓA SẢN PHẨM (DELETE: api/ProductsApi/5)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Sản phẩm không tồn tại để xóa!" });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa sản phẩm thành công!" });
        }
    }
}