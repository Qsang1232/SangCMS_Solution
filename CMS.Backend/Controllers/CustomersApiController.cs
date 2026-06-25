using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers
{
    [Route("api/CustomersApi")] // Đường dẫn API gọi từ React: /api/CustomersApi
    [ApiController]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService; // Tiêm dịch vụ gửi Email

        public CustomersApiController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ==========================================
        // 1. API ĐĂNG KÝ TÀI KHOẢN (REGISTER)
        // ==========================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Customer registerData)
        {
            try
            {
                // Kiểm tra xem Email đã có ai đăng ký chưa
                var emailExists = await _context.Customers.AnyAsync(c => c.Email == registerData.Email);
                if (emailExists)
                {
                    return BadRequest(new { message = "Email này đã được sử dụng!" });
                }

                // Ứng dụng thuật toán BCrypt để băm mật khẩu trước khi lưu
                registerData.Password = BCrypt.Net.BCrypt.HashPassword(registerData.Password);

                // Lưu tài khoản mới vào Database
                _context.Customers.Add(registerData);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đăng ký thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi Server", error = ex.Message });
            }
        }

        // Khuôn hứng dữ liệu Đăng nhập
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        // ==========================================
        // 2. API ĐĂNG NHẬP (LOGIN)
        // ==========================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginData)
        {
            try
            {
                // Tìm khách hàng có Email khớp với dữ liệu gửi lên
                var user = await _context.Customers.FirstOrDefaultAsync(c => c.Email == loginData.Email);

                if (user == null)
                {
                    return Unauthorized(new { message = "Sai email hoặc mật khẩu!" });
                }

                bool isPasswordValid = false;
                try
                {
                    // Thử giải mã BCrypt (dành cho mật khẩu mới đã băm)
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(loginData.Password, user.Password);
                }
                catch
                {
                    // BẤT ĐỒNG BỘ: Mật khẩu cũ trong database đang là văn bản thô (Plain text),
                    // BCrypt.Verify sẽ quăng lỗi Exception vì định dạng hash không đúng.
                    // Chúng ta Catch lại và so sánh trực tiếp văn bản thô luôn.
                    isPasswordValid = (user.Password == loginData.Password);
                }

                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Sai email hoặc mật khẩu!" });
                }

                // Trả về thông tin user (che đi mật khẩu để bảo mật)
                return Ok(new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    phone = user.Phone
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi Server", error = ex.Message });
            }
        }

        // Khuôn hứng dữ liệu Quên mật khẩu
        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        // ==========================================
        // 3. API QUÊN MẬT KHẨU (FORGOT PASSWORD)
        // ==========================================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                // 1. Tìm user theo Email
                var user = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
                if (user == null)
                {
                    return NotFound(new { message = "Email này chưa được đăng ký trong hệ thống!" });
                }

                // 2. Sinh mật khẩu ngẫu nhiên 8 ký tự
                string newPassword = Guid.NewGuid().ToString().Substring(0, 8);

                // 3. Băm mật khẩu mới bằng BCrypt và lưu vào Database
                user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                _context.Customers.Update(user);
                await _context.SaveChangesAsync();

                // 4. Gửi Email thông báo mật khẩu mới cho khách hàng
                string subject = "Yêu cầu cấp lại mật khẩu - SangCMS Bikes";
                string htmlMessage = $@"
                    <h3>Chào {user.FullName},</h3>
                    <p>Hệ thống đã nhận được yêu cầu cấp lại mật khẩu tài khoản của bạn.</p>
                    <p>Mật khẩu đăng nhập mới của bạn là: <strong style='color:red; font-size: 18px;'>{newPassword}</strong></p>
                    <p>Vui lòng đăng nhập và đổi lại mật khẩu ngay để đảm bảo an toàn.</p>
                    <br/><p>Trân trọng,<br/>Đội ngũ SangCMS Bikes</p>
                ";

                await _emailService.SendEmailAsync(user.Email, subject, htmlMessage);

                return Ok(new { success = true, message = "Mật khẩu mới đã được gửi vào Email của bạn!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi gửi email: " + ex.Message });
            }
        }
    }
}