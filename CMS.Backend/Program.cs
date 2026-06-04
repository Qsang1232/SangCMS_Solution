/*
 * Ho va ten : Nguyễn Quốc Sang
 * Msvv       : 2123110076
 * Noi dung   : Cấu hình hệ thống, CORS, Cookie Authentication và Web API (Buổi 7)
 */

using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// 1. ĐĂNG KÝ CÁC DỊCH VỤ (SERVICES)
// ==========================================================

builder.Services.AddControllersWithViews();

// Đăng ký DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dịch vụ cho Web API
builder.Services.AddEndpointsApiExplorer(); // Tự động bóc tách Endpoint
builder.Services.AddSwaggerGen();           // Kích hoạt Swagger UI

// CẤU HÌNH CORS (Chỉ giữ lại một chính sách chuẩn theo yêu cầu Buổi 7)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});

// Kích hoạt xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

var app = builder.Build();

// ==========================================================
// 2. CẤU HÌNH MIDDLEWARE (PIPELINE) - THỨ TỰ RẤT QUAN TRỌNG!
// ==========================================================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Hiển thị Swagger UI (chỉ khi đang ở chế độ phát triển)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiCMS Web API v1");
    });
}

app.UseRouting();

// BẮT BUỘC: Kích hoạt CORS (Nằm giữa UseRouting và UseAuthentication)
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// ==========================================================
// 3. ĐỊNH TUYẾN PHÂN LUỒNG (ROUTING MAP)
// ==========================================================

// Phân luồng cho Web API (Ánh xạ các Controller API)
app.MapControllers();

// Phân luồng cho Web MVC
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();