/*
 *Ho va ten :Nguyễn Quốc Sang
 *Msvv:2123110076
 *Ngay tao:14/5/2026 
 *version 1.0
 */


namespace CMS.Data.Entities
{
    // thuc the danh muc bai viet
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; }

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; }
    }
}