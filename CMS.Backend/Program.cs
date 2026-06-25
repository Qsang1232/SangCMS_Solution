/*
 * Ho va ten : Nguyễn Quốc Sang
 * Msvv       : 2123110076
 * Noi dung   : Cấu hình hệ thống, CORS, Cookie Authentication, Web API và Email Services
 */
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// 1. ĐĂNG KÝ CÁC DỊCH VỤ (SERVICES)
// ==========================================================
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        // Fix lỗi 500 (Vòng lặp vô hạn JSON giữa Product và CategoryProduct)
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Đăng ký DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dịch vụ cho Web API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CẤU HÌNH CORS (Chính sách mở cổng cho ReactJS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Kích hoạt xác thực Cookie cho Admin
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

// Đăng ký EmailService để dùng ở các Controller (Chức năng gửi mail)
builder.Services.AddScoped<CMS.Backend.Services.EmailService>();

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
// Phân luồng cho Web API 
app.MapControllers();

// Phân luồng cho Web MVC (Trang Quản trị)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();