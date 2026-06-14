/*
 *Ho va ten :Nguyễn Quốc Sang
 *Msvv:2123110076
 *Ngay tao:14/5/2026 
 *version 1.0   
 */
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;

[Authorize]
public class CategoryController : Controller
{
    private readonly ApplicationDbContext _context;

    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Hiển thị danh sách danh mục
    public IActionResult Index()
    {
        var data = _context.Categories.ToList();
        return View(data);
    }

    // 1. Hàm GET: Hiển thị giao diện Form Thêm mới
    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    // 2. Hàm POST: Đón dữ liệu thêm mới và ĐỒNG BỘ cả 2 bảng (Đã sửa lỗi crash)
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Category model)
    {
        // Bỏ qua kiểm tra ModelState để thông Form tuyệt đối
        try
        {
            // Bước A: Thêm dữ liệu vào bảng gốc dbo.Categories
            _context.Categories.Add(model);
            await _context.SaveChangesAsync(); // SQL tự sinh ra ID tự tăng cho model

            // Bước B: Đồng bộ sang bảng phụ dbo.CategoriesProducts
            var linkedCategory = new CategoryProduct
            {
                Id = model.Id, // Khớp lệnh ID vừa sinh
                Name = model.Name,
                Description = model.Description
            };

            // Thực hiện thêm trực tiếp, nếu lỗi IDENTITY sẽ tự động xử lý qua Catch
            try
            {
                _context.CategoriesProducts.Add(linkedCategory);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Nếu dính cấu hình Identity, chạy lệnh nạp SQL thô an toàn
                string sql = "SET IDENTITY_INSERT dbo.CategoriesProducts ON; " +
                             "INSERT INTO dbo.CategoriesProducts (Id, Name, Description) VALUES ({0}, {1}, {2}); " +
                             "SET IDENTITY_INSERT dbo.CategoriesProducts OFF;";
                await _context.Database.ExecuteSqlRawAsync(sql, model.Id, model.Name, model.Description ?? (object)DBNull.Value);
            }

            return RedirectToAction("Index");
        }
        catch (Exception ex)
        {
            ModelState.AddModelError("", "Lỗi hệ thống: " + ex.Message);
            return View(model);
        }
    }

    // 1. Hàm GET: Tìm dữ liệu cũ theo ID và đổ lên Form Edit
    [HttpGet]
    public IActionResult Edit(int id)
    {
        var category = _context.Categories.Find(id);
        if (category == null) return NotFound();

        return View(category);
    }

    // 2. Hàm POST: Nhận dữ liệu sửa đổi mới và ĐỒNG BỘ chỉnh sửa sang cả 2 bảng
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Category model)
    {
        try
        {
            // 1. Cập nhật bảng gốc dbo.Categories
            _context.Categories.Update(model);

            // 2. Tự động đồng bộ tên mới sang bảng liên kết dbo.CategoriesProducts
            var linkedCategory = await _context.CategoriesProducts.FindAsync(model.Id);
            if (linkedCategory != null)
            {
                linkedCategory.Name = model.Name;
                linkedCategory.Description = model.Description;
                _context.CategoriesProducts.Update(linkedCategory);
            }
            else
            {
                // Nếu bảng phụ bị thiếu dòng do lỗi cũ, tự bù dòng mới vào luôn
                var newLink = new CategoryProduct { Id = model.Id, Name = model.Name, Description = model.Description };
                _context.CategoriesProducts.Add(newLink);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }
        catch (Exception ex)
        {
            ModelState.AddModelError("", "Không thể lưu thay đổi: " + ex.Message);
            return View(model);
        }
    }

    // 3. Chức năng XÓA danh mục và ĐỒNG BỘ xóa cả 2 bảng
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category != null)
        {
            // Xóa ở bảng gốc
            _context.Categories.Remove(category);

            // Tự động tìm dữ liệu ở bảng liên kết và xóa theo luôn để dọn rác DB
            var linkedCategory = await _context.CategoriesProducts.FindAsync(id);
            if (linkedCategory != null)
            {
                _context.CategoriesProducts.Remove(linkedCategory);
            }

            await _context.SaveChangesAsync();
        }

        return RedirectToAction("Index");
    }
}