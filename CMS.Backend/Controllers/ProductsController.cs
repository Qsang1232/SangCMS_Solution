using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public System.Globalization.CultureInfo Culture { get; } = new System.Globalization.CultureInfo("en-US");

        public ProductsController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // ==========================================
        // 1. TRANG DANH SÁCH SẢN PHẨM (INDEX)
        // ==========================================
        public async Task<IActionResult> Index()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .ToListAsync();
            return View(products);
        }

        // ==========================================
        // 2. CHỨC NĂNG THÊM MỚI SẢN PHẨM (CREATE)
        // ==========================================
        public IActionResult Create()
        {
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, IFormFile uploadedImage)
        {
            try
            {
                // Xử lý upload file ảnh từ máy tính
                if (uploadedImage != null && uploadedImage.Length > 0)
                {
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "products");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadedImage.FileName);
                    string filePath = Path.Combine(uploadDir, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await uploadedImage.CopyToAsync(fileStream);
                    }

                    product.ImageUrl = "/uploads/products/" + fileName;
                }
                else
                {
                    product.ImageUrl = "/images/no-image.png";
                }

                // Chống lỗi NULL trường số lượng kho
                if (product.StockQuantity == null || product.StockQuantity < 0)
                {
                    product.StockQuantity = 0;
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi lưu dữ liệu: " + ex.Message);
                ViewBag.Categories = _context.Categories.ToList();
                return View(product);
            }
        }

        // ==========================================
        // 3. CHỨC NĂNG CHỈNH SỬA SẢN PHẨM (EDIT) -> KHÔNG CẦN ĐỔI ẢNH VẪN LƯU ĐƯỢC
        // ==========================================
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            ViewBag.Categories = _context.Categories.ToList();
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product productInput, IFormFile uploadedImage)
        {
            if (id != productInput.Id) return NotFound();

            try
            {
                // Lấy thực thể gốc đang nằm trong Database ra để sửa đổi
                var existingProduct = await _context.Products.FindAsync(id);
                if (existingProduct == null) return NotFound();

                // KIỂM TRA ẢNH: Nếu người dùng chọn file ảnh mới
                if (uploadedImage != null && uploadedImage.Length > 0)
                {
                    string uploadDir = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "products");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    // Xóa file ảnh cũ vứt đi cho sạch ổ đĩa
                    if (!string.IsNullOrEmpty(existingProduct.ImageUrl) && !existingProduct.ImageUrl.Contains("no-image.png"))
                    {
                        string oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, existingProduct.ImageUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadedImage.FileName);
                    string filePath = Path.Combine(uploadDir, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await uploadedImage.CopyToAsync(fileStream);
                    }

                    // Đổ đường dẫn ảnh mới vào database
                    existingProduct.ImageUrl = "/uploads/products/" + fileName;
                }
                // NẾU KHÔNG CHỌN ẢNH MỚI: Code sẽ tự động giữ nguyên đường dẫn ảnh cũ (existingProduct.ImageUrl giữ nguyên)

                // Cập nhật các thông tin văn bản chữ/số từ form gửi lên vào thực thể gốc
                existingProduct.Name = productInput.Name;
                existingProduct.Description = productInput.Description;
                existingProduct.CategoryProductId = productInput.CategoryProductId;
                existingProduct.Price = productInput.Price;
                existingProduct.StockQuantity = productInput.StockQuantity >= 0 ? productInput.StockQuantity : 0;

                _context.Products.Update(existingProduct);
                await _context.SaveChangesAsync(); // Đồng bộ trực tiếp xuống SQL Server

                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi lưu thay đổi: " + ex.Message);
                ViewBag.Categories = _context.Categories.ToList();
                return View(productInput);
            }
        }

        // ==========================================
        // 4. CHỨC NĂNG XÓA SẢN PHẨM (DELETE)
        // ==========================================
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                if (!string.IsNullOrEmpty(product.ImageUrl) && !product.ImageUrl.Contains("no-image.png"))
                {
                    string filePath = Path.Combine(_webHostEnvironment.WebRootPath, product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}