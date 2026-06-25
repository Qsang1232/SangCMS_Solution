/*
 *Ho va ten :Nguyễn Quốc Sang
 *Msvv:2123110076
 *Noi dung: Trang quản trị Khách hàng (CRUD)
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Linq;
using CMS.Data;
using CMS.Data.Entities;
using X.PagedList;
using X.PagedList.Extensions;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CustomersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. DANH SÁCH KHÁCH HÀNG (INDEX) - CÓ PHÂN TRANG
        // ==========================================
        public async Task<IActionResult> Index(int? page)
        {
            int pageNumber = page ?? 1;
            int pageSize = 10;

            var customers = await _context.Customers
                .OrderByDescending(c => c.Id)
                .ToListAsync();

            var pagedCustomers = customers.ToPagedList(pageNumber, pageSize);
            return View(pagedCustomers);
        }

        // ==========================================
        // 2. THÊM KHÁCH HÀNG MỚI (CREATE)
        // ==========================================
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Customer customer)
        {
            try
            {
                // Kiểm tra Email đã tồn tại chưa
                var emailExists = await _context.Customers.AnyAsync(c => c.Email == customer.Email);
                if (emailExists)
                {
                    ModelState.AddModelError("Email", "Email này đã được sử dụng bởi khách hàng khác!");
                    return View(customer);
                }

                // Băm mật khẩu bằng BCrypt trước khi lưu
                customer.Password = BCrypt.Net.BCrypt.HashPassword(customer.Password);

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Thêm khách hàng mới thành công!";
                return RedirectToAction(nameof(Index));
            }
            catch (System.Exception ex)
            {
                ModelState.AddModelError("", "Lỗi lưu dữ liệu: " + ex.Message);
                return View(customer);
            }
        }

        // ==========================================
        // 3. CHỈNH SỬA KHÁCH HÀNG (EDIT)
        // ==========================================
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();

            return View(customer);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Customer customerInput)
        {
            if (id != customerInput.Id) return NotFound();

            try
            {
                var existingCustomer = await _context.Customers.FindAsync(id);
                if (existingCustomer == null) return NotFound();

                // Kiểm tra Email trùng với khách hàng khác
                var emailExists = await _context.Customers.AnyAsync(c => c.Email == customerInput.Email && c.Id != id);
                if (emailExists)
                {
                    ModelState.AddModelError("Email", "Email này đã được sử dụng bởi khách hàng khác!");
                    return View(customerInput);
                }

                // Cập nhật thông tin
                existingCustomer.FullName = customerInput.FullName;
                existingCustomer.Email = customerInput.Email;
                existingCustomer.Phone = customerInput.Phone;
                existingCustomer.Address = customerInput.Address;

                // Chỉ đổi mật khẩu nếu Admin nhập mật khẩu mới
                if (!string.IsNullOrWhiteSpace(customerInput.Password))
                {
                    existingCustomer.Password = BCrypt.Net.BCrypt.HashPassword(customerInput.Password);
                }

                _context.Customers.Update(existingCustomer);
                await _context.SaveChangesAsync();

                TempData["Success"] = "Cập nhật khách hàng thành công!";
                return RedirectToAction(nameof(Index));
            }
            catch (System.Exception ex)
            {
                ModelState.AddModelError("", "Lỗi lưu thay đổi: " + ex.Message);
                return View(customerInput);
            }
        }

        // ==========================================
        // 4. XÓA KHÁCH HÀNG (DELETE)
        // ==========================================
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Đã xóa khách hàng thành công!";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
