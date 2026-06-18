using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Controllers
{
    [Route("api/CustomersApi")] // Đường dẫn API
    [ApiController]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. API ĐĂNG KÝ TÀI KHOẢN (REGISTER)
        // URL: POST /api/CustomersApi/register
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

        // --------------------------------------------------------
        // TẠO KHUÔN NHẬN DỮ LIỆU ĐĂNG NHẬP (Để lách luật [Required] của C#)
        // --------------------------------------------------------
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        // ==========================================
        // 2. API ĐĂNG NHẬP (LOGIN)
        // URL: POST /api/CustomersApi/login
        // ==========================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginData) // <--- Đã sửa ở đây!
        {
            try
            {
                // Tìm khách hàng có Email và Mật khẩu khớp với dữ liệu gửi lên
                var user = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email == loginData.Email && c.Password == loginData.Password);

                if (user == null)
                {
                    // Trả về lỗi 401 nếu sai tài khoản / mật khẩu
                    return Unauthorized(new { message = "Sai email hoặc mật khẩu!" });
                }

                // Trả về thông tin user (nhưng che đi mật khẩu cho an toàn)
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
    }
}