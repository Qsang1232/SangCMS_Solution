/*
 * Ho va ten : Nguyễn Quốc Sang
 * Msvv      : 2123110076
 * Noi dung  : Cấu hình hệ thống và kích hoạt Cookie Authentication (Buổi 5)
 */

using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// 1. ĐĂNG KÝ CÁC DỊCH VỤ (SERVICES) - PHẢI ĐẶT TRƯỚC BUILDER.BUILD()
// ==========================================================

builder.Services.AddControllersWithViews();

// Đăng ký DbContext kết nối SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// KÍCH HOẠT DỊCH VỤ XÁC THỰC COOKIE (Đã sửa từ Account sang Auth theo đúng bài của thầy)
// KÍCH HOẠT DỊCH VỤ XÁC THỰC COOKIE (Đã sửa từ Auth thành Account)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";          // Phải sửa thành /Account/Login
        options.AccessDeniedPath = "/Account/AccessDenied"; // Phải sửa thành /Account/AccessDenied
    });

// Khởi tạo ứng dụng từ cấu hình dịch vụ trên
var app = builder.Build();

// ==========================================================
// 2. CẤU HÌNH MIDDLEWARE (PIPELINE) - PHẢI ĐẶT SAU BUILDER.BUILD()
// ==========================================================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// BẮT BUỘC: Đi qua trạm kiểm soát danh tính (Authentication) trước khi phân quyền (Authorization)
app.UseAuthentication();
app.UseAuthorization();

// Định tuyến đường dẫn mặc định
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();