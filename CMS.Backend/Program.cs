/*
 * Ho va ten : Nguyễn Quốc Sang
 * Msvv      : 2123110076
 * Noi dung  : Cấu hình hệ thống, Cookie Authentication và Web API (Buổi 6)
 */

using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// 1. ĐĂNG KÝ CÁC DỊCH VỤ (SERVICES)
// ==========================================================

builder.Services.AddControllersWithViews();

// Đăng ký DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// BỔ SUNG: Dịch vụ cho Web API
builder.Services.AddEndpointsApiExplorer(); // Tự động bóc tách Endpoint
builder.Services.AddSwaggerGen();           // Kích hoạt Swagger UI

// BỔ SUNG: Cấu hình CORS (Cho phép React gọi API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Kích hoạt xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        // Cho phép mọi nguồn cấp (Origin), mọi phương thức gọi (GET, POST...), và mọi thông tin đi kèm (Header)
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ==========================================================
// 2. CẤU HÌNH MIDDLEWARE (PIPELINE)
// ==========================================================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// BỔ SUNG: Hiển thị Swagger UI (chỉ khi đang ở chế độ phát triển)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiCMS Web API v1");
    });
}

app.UseRouting();
app.UseCors("AllowAll");
// BẮT BUỘC: CORS phải nằm giữa Routing và Authentication
app.UseCors("AllowAll");

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