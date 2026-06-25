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

        // 1. API LẤY DANH SÁCH SẢN PHẨM CÓ BỘ LỌC (GET: api/ProductsApi?categoryProductId=1&minPrice=100000&maxPrice=500000&keyword=mtb)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
            [FromQuery] int? categoryProductId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? keyword)
        {
            // Bắt đầu từ toàn bộ sản phẩm
            var query = _context.Products.AsQueryable();

            // Lọc theo danh mục sản phẩm
            if (categoryProductId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
            }

            // Lọc theo khoảng giá TỪ
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            // Lọc theo khoảng giá ĐẾN
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // Lọc theo từ khóa tìm kiếm (tìm trong tên hoặc mô tả)
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword) || (p.Description != null && p.Description.Contains(keyword)));
            }

            return await query.OrderByDescending(p => p.Id).ToListAsync();
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