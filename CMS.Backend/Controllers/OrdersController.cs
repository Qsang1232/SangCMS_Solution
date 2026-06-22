using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using X.PagedList;
using X.PagedList.Extensions;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrdersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Hiển thị danh sách đơn hàng có phân trang
        public IActionResult Index(int? page)
        {
            int pageSize = 10;
            int pageNumber = page ?? 1;

            var orders = _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .ToPagedList(pageNumber, pageSize);

            return View(orders);
        }

        // 2. Xem chi tiết một đơn hàng
        public async Task<IActionResult> Details(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();
            return View(order);
        }

        // 3. GET: Thêm mới đơn hàng
        public IActionResult Create()
        {
            return View();
        }

        // 4. POST: Thêm mới đơn hàng
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Order order)
        {
            order.OrderDate = DateTime.Now;
            order.Status = 0;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Tạo đơn hàng mới thành công!";
            return RedirectToAction(nameof(Index));
        }

        // 5. GET: Chỉnh sửa trạng thái đơn hàng
        public async Task<IActionResult> Edit(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            return View(order);
        }

        // 6. POST: Chỉnh sửa trạng thái đơn hàng
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Order order)
        {
            var dbOrder = await _context.Orders.FindAsync(id);
            if (dbOrder == null) return NotFound();

            dbOrder.Status = order.Status;
            dbOrder.CustomerName = order.CustomerName;
            dbOrder.Phone = order.Phone;
            dbOrder.TotalAmount = order.TotalAmount;
            dbOrder.Address = order.Address;
            dbOrder.Notes = order.Notes;

            await _context.SaveChangesAsync();

            TempData["Success"] = $"Cập nhật đơn hàng #{id} thành công!";
            return RedirectToAction(nameof(Index));
        }

        // 7. Xóa đơn hàng
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                var details = _context.OrderDetails.Where(d => d.OrderId == id);
                _context.OrderDetails.RemoveRange(details);

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                TempData["Success"] = $"Đã xóa thành công đơn hàng #{id}.";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}