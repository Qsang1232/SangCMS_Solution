/*
 * Ho va ten : Nguyễn Quốc Sang
 * Msvv      : 2123110076
 * Ngay tao  : 28/05/2026 
 * Version   : 2.0 (Cập nhật Phân quyền & Bảo mật hệ thống)
 */
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Chỉ tài khoản có Role là Admin mới được phép vào
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. TRANG DANH SÁCH THÀNH VIÊN (INDEX)
        // ==========================================
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // ==========================================
        // 2. XEM CHI TIẾT THÀNH VIÊN (DETAILS)
        // ==========================================
        public IActionResult Details(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        // ==========================================
        // 3. CHỨC NĂNG: THÊM MỚI THÀNH VIÊN (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra trùng tên đăng nhập
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            if (model != null)
            {
                _context.Users.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // ==========================================
        // 4. CHỨC NĂNG: CHỈNH SỬA THÀNH VIÊN (EDIT)
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu người dùng để trống
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // 2. Xử lý logic mật khẩu nâng cao theo đúng yêu cầu bài học
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword; // Nhập mới -> Lấy mật khẩu mới
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash; // Để trống -> Giữ lại mật khẩu cũ
            }

            if (model != null)
            {
                _context.Users.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // ==========================================
        // 5. CHỨC NĂNG: XÓA THÀNH VIÊN (DELETE)
        // ==========================================
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}