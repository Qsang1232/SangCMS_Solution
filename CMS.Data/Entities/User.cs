/*
 *Ho va ten :Nguyễn Quốc Sang
 *Msvv:2123110076
 *Ngay tao:14/5/2026 
 *version 1.0
 */


namespace CMS.Data.Entities
{
    // thuc the nhan vien quan tri
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }
}