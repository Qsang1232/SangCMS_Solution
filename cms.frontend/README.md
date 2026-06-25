# 🚲 SangCMS Bikes - Hệ thống Quản lý và Bán xe đạp trực tuyến

**Sinh viên thực hiện:** Nguyễn Quốc Sang
**Mã sinh viên:** 2123110076

Đây là đồ án chuyên ngành ứng dụng kiến trúc 3 phân tầng (3-tier architecture) kết hợp giữa **ASP.NET Core Web API / MVC** (Backend) và **ReactJS** (Frontend).

## 🚀 Hướng dẫn khởi chạy dự án

### 1. Khởi chạy Backend (.NET Core)
- Mở file Solution `SangCMS_Solution.sln` bằng **Visual Studio**.
- Đảm bảo dự án `CMS.Backend` được đặt làm **Startup Project** (Click chuột phải vào CMS.Backend -> Chọn *Set as Startup Project*).
- Mở file `appsettings.json`, kiểm tra và cập nhật chuỗi kết nối cơ sở dữ liệu `DefaultConnection`.
- Mở **Package Manager Console** (PMC), chọn *Default project* là `CMS.Data` và chạy lệnh cập nhật CSDL:
Update-Database

- Nhấn phím **F5** (hoặc nút Run) để khởi chạy máy chủ Backend và giao diện Swagger API.

### 2. Khởi chạy Frontend (ReactJS)
- Mở một cửa sổ Terminal/Command Prompt mới.
- Di chuyển vào thư mục Frontend:
```bash
cd cms.frontend Cài đặt các gói thư viện cần thiết (chỉ cần chạy lần đầu):

Bash
npm install
Khởi chạy ứng dụng ReactJS:

Bash
npm start
Trình duyệt sẽ tự động mở trang web tại địa chỉ http://localhost:3000.

⚙️ Các công nghệ sử dụng
Backend: C#, ASP.NET Core MVC & Web API, Entity Framework Core, SQL Server.

Frontend: ReactJS, Bootstrap, Axios.

Bảo mật & Tiện ích: BCrypt (Mã hóa mật khẩu), Cookie Authentication, CKEditor 4, X.PagedList (Phân trang), MailKit (Gửi Email SMTP).


