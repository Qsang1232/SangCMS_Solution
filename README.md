 SangCMS Bikes - Hệ Thống Quản Lý Cửa Hàng Xe Đạp
Sinh viên: Nguyễn Quốc Sang
MSSV: 2123110076
Môn: Chuyên Đề ASP.NET

📁 Cấu Trúc Dự Án (3 Phân Tầng)
SangCMS_Solution-Buoi-8/
├── CMS.Data/            → Tầng dữ liệu (Entity Framework Core, 8 Entities)
├── CMS.Backend/         → Tầng xử lý (ASP.NET Core MVC + Web API)
├── cms.frontend/        → Tầng giao diện khách hàng (ReactJS)
└── Sang-CMS_Solution.sln → File Solution tổng
🔧 Hướng Dẫn Chạy Dự Án
1. Chạy Backend (ASP.NET Core)
Mở file Sang-CMS_Solution.sln bằng Visual Studio 2022.
Đảm bảo đã cài SQL Server (LocalDB hoặc SQL Server Express).
Mở Package Manager Console, chọn Default Project là CMS.Data, chạy lệnh:
Update-Database
Nhấn F5 để khởi chạy Backend.
Backend sẽ chạy tại: https://localhost:7111
Truy cập Swagger UI tại: https://localhost:7111/swagger
2. Chạy Frontend (ReactJS)
Mở terminal tại thư mục cms.frontend/.
Cài đặt thư viện:
npm install
Khởi chạy ứng dụng React:
npm start
Trình duyệt sẽ tự mở tại: http://localhost:3000
Lưu ý: Backend phải được chạy trước (bước 1) để Frontend có thể nạp dữ liệu từ API.

🗄️ Cơ Sở Dữ Liệu (8 Bảng)
STT	Tên Bảng	Mô Tả
1	Categories	Danh mục bài viết
2	Posts	Bài viết / Tin tức
3	Users	Tài khoản quản trị viên
4	CategoriesProducts	Danh mục sản phẩm
5	Products	Sản phẩm xe đạp
6	Customers	Tài khoản khách hàng
7	Orders	Đơn hàng
8	OrderDetails	Chi tiết đơn hàng
⚙️ Công Nghệ Sử Dụng
Backend: ASP.NET Core 8, Entity Framework Core, Cookie Authentication
Frontend: ReactJS 19, React Router DOM, Axios
Database: SQL Server (LocalDB)
Bảo mật: BCrypt (băm mật khẩu), CORS, [Authorize], [Authorize(Roles)]
Tiện ích: CKEditor 4, X.PagedList, Swagger UI, EmailService (SMTP Gmail)
