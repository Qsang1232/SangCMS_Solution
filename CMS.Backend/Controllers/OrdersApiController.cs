using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // MỤC 4: API LẤY DANH SÁCH TOÀN BỘ ĐƠN HÀNG (KÈM KHÁCH HÀNG)
        // URL: GET /api/OrdersApi
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                // Dùng .Include(o => o.Customer) nếu database của bạn có bảng Customers riêng lẻ
                // Hoặc nếu bạn lưu trực tiếp tên vào bảng Order thì bỏ Include đi.
                var orders = await _context.Orders
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        // ==========================================
        // MỤC 5: API LẤY CHI TIẾT CỦA MỘT ĐƠN HÀNG (KÈM SẢN PHẨM)
        // URL: GET /api/OrdersApi/{orderId}/details
        // ==========================================
        [HttpGet("{orderId}/details")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            try
            {
                // Kiểm tra đơn hàng có tồn tại không
                var orderExists = await _context.Orders.AnyAsync(o => o.Id == orderId);
                if (!orderExists) return NotFound("Không tìm thấy đơn hàng yêu cầu.");

                // Lấy danh sách chi tiết đơn hàng, nạp kèm thông tin Product để lấy Name, Price...
                var details = await _context.OrderDetails
                    .Include(d => d.ProductId)
                    .Where(d => d.OrderId == orderId)
                    .ToListAsync();

                return Ok(details);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        // ==========================================
        // MỤC 3: API LẤY DANH SÁCH KHÁCH HÀNG (Nếu cần dùng riêng)
        // URL: GET /api/OrdersApi/customers
        // ==========================================
        [HttpGet("customers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                // Giả định bạn có DbSet<Customer> Customers trong ApplicationDbContext
                var customers = await _context.Customers.ToListAsync();
                return Ok(customers);
            }
            catch (Exception)
            {
                // Nếu dự án của bạn lưu thông tin khách chung vào bảng Order (CustomerName), 
                // ta có thể group by để lấy danh sách khách hàng độc bản:
                var customersFromOrders = await _context.Orders
                    .Select(o => new { o.CustomerName, o.Address })
                    .Distinct()
                    .ToListAsync();

                return Ok(customersFromOrders);
            }
        }

        // API ĐĂNG KÝ ĐƠN HÀNG (Có sẵn của bạn)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null) return BadRequest("Dữ liệu đơn hàng không hợp lệ.");

            order.OrderDate = DateTime.Now;
            order.Status = 0; // 0: Chờ duyệt

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, orderId = order.Id, message = "Đặt hàng thành công." });
        }
        // ==========================================
        // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (0: Chờ duyệt, 1: Đang giao, 2: Đã xong)
        // URL: PUT /api/OrdersApi/{id}/status
        // ==========================================
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] int newStatus)
        {
            try
            {
                var dbOrder = await _context.Orders.FindAsync(id);
                if (dbOrder == null) return NotFound("Không tìm thấy đơn hàng.");

                // Cập nhật trạng thái mới nhận từ Frontend
                dbOrder.Status = newStatus;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Cập nhật trạng thái thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        // ==========================================
        // XÓA ĐƠN HÀNG (Xóa cả Chi tiết đơn hàng liên quan để tránh lỗi khóa ngoại)
        // URL: DELETE /api/OrdersApi/{id}
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null) return NotFound("Không tìm thấy đơn hàng cần xóa.");

                // 1. Xóa các chi tiết thuộc đơn hàng trước
                var details = _context.OrderDetails.Where(d => d.OrderId == id);
                _context.OrderDetails.RemoveRange(details);

                // 2. Xóa đơn hàng chính
                _context.Orders.Remove(order);

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Xóa đơn hàng thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }
}