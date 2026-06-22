using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService; // Tiêm dịch vụ gửi Email

        public OrdersApiController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ==========================================
        // 1. API LẤY DANH SÁCH TOÀN BỘ ĐƠN HÀNG
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
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
        // 2. API LẤY CHI TIẾT CỦA MỘT ĐƠN HÀNG
        // ==========================================
        [HttpGet("{orderId}/details")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            try
            {
                var orderExists = await _context.Orders.AnyAsync(o => o.Id == orderId);
                if (!orderExists) return NotFound("Không tìm thấy đơn hàng yêu cầu.");

                var details = await _context.OrderDetails
                    .Include(d => d.ProductId) // Nếu lỗi Include, bỏ dòng này đi
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
        // 3. API ĐẶT HÀNG MỚI (TẠO ĐƠN & TRỪ TỒN KHO)
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order orderRequest)
        {
            if (orderRequest == null || orderRequest.OrderDetails == null || !orderRequest.OrderDetails.Any())
                return BadRequest(new { message = "Giỏ hàng trống hoặc dữ liệu không hợp lệ." });

            // Bật Transaction để bảo vệ toàn vẹn dữ liệu
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                orderRequest.OrderDate = DateTime.Now;
                orderRequest.Status = 0; // Chờ duyệt

                var details = orderRequest.OrderDetails.ToList();
                orderRequest.OrderDetails = null; // Tạm ngắt liên kết để Insert Order trước

                _context.Orders.Add(orderRequest);
                await _context.SaveChangesAsync();

                decimal totalAmount = 0;

                foreach (var item in details)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);

                    if (product == null)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = $"Sản phẩm mã #{item.ProductId} không tồn tại!" });
                    }

                    // KIỂM TRA CHỐNG TRÀN KHO
                    if (product.StockQuantity < item.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = $"Sản phẩm [{product.Name}] chỉ còn {product.StockQuantity} chiếc trong kho!" });
                    }

                    // Trừ tồn kho
                    product.StockQuantity -= item.Quantity;
                    _context.Products.Update(product);

                    item.OrderId = orderRequest.Id;
                    _context.OrderDetails.Add(item);
                    totalAmount += (item.Quantity * item.Price);
                }

                orderRequest.TotalAmount = totalAmount;
                _context.Orders.Update(orderRequest);
                await _context.SaveChangesAsync();

                // Chốt Transaction
                await transaction.CommitAsync();

                // ===============================================
                // GỬI EMAIL XÁC NHẬN CHO KHÁCH HÀNG
                // ===============================================
                if (!string.IsNullOrEmpty(orderRequest.CustomerName))
                {
                    // Lấy email để test hoặc nhận từ React
                    string customerEmail = "sangnguyenquoc111@gmail.com"; // Đổi thành Email thật nếu cần

                    string subject = $"[SangCMS Bikes] Xác nhận đơn hàng #{orderRequest.Id} thành công!";
                    string body = $@"
                        <h3>Chào {orderRequest.CustomerName},</h3>
                        <p>Cảm ơn bạn đã đặt mua hàng tại SangCMS Bikes.</p>
                        <p>Mã đơn hàng: <strong>#{orderRequest.Id}</strong></p>
                        <p>Tổng thanh toán: <strong style='color:red;'>{orderRequest.TotalAmount:N0} đ</strong></p>
                        <p>Chúng tôi sẽ sớm liên hệ qua SĐT <b>{orderRequest.Phone}</b> để giao hàng đến địa chỉ: {orderRequest.Address}.</p>
                        <br/><p>Trân trọng,<br/>Đội ngũ SangCMS Bikes</p>";

                    // Chạy ngầm tiến trình gửi mail để không làm khựng API
                    _ = _emailService.SendEmailAsync(customerEmail, subject, body);
                }

                return Ok(new { success = true, orderId = orderRequest.Id, message = "Đặt hàng thành công." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = $"Lỗi hệ thống khi tạo đơn hàng: {ex.Message}" });
            }
        }

        // ==========================================
        // 4. API CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
        // ==========================================
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] int newStatus)
        {
            try
            {
                var dbOrder = await _context.Orders.FindAsync(id);
                if (dbOrder == null) return NotFound("Không tìm thấy đơn hàng.");

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
        // 5. API XÓA ĐƠN HÀNG
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null) return NotFound("Không tìm thấy đơn hàng cần xóa.");

                var details = _context.OrderDetails.Where(d => d.OrderId == id);
                _context.OrderDetails.RemoveRange(details);

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