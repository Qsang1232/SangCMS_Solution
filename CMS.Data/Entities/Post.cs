/*
 *Ho va ten :Nguyễn Quốc Sang
 *Msvv:2123110076
 *Ngay tao:14/5/2026 
 *version 1.0
 */


namespace CMS.Data.Entities
{
    // thuc the bai viet
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } // Tiêu đề bài viết
        public string Content { get; set; } // Nội dung chi tiết
        public string ImageUrl { get; set; } // Hình ảnh đại diện
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Khóa ngoại liên kết tới Category
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}
