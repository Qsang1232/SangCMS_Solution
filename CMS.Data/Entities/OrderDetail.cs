/*
 *Ho va ten :Nguyễn Quốc Sang
 *Msvv:2123110076
 *Ngay tao:14/5/2026 
 *version 1.0
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// Cần phải có namespace để đồng bộ với Order.cs
namespace CMS.Data.Entities
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        // Đã thêm cấu hình decimal để không bị cảnh báo khi Add-Migration
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // Khóa ngoại liên kết ngược lại bảng Order (Rất cần thiết cho EF Core)
        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }
    }
}