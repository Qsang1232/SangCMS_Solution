/*
*Ho va ten :Nguyễn Quốc Sang
*Msvv:2123110076
*Ngay tao:14/5/2024
*version 1.0
*/
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        // Cho phép Null để khách vãng lai có thể mua hàng
        public int? CustomerId { get; set; }

        public int Status { get; set; } = 0; // Mặc định đơn hàng mới là 0 (Chờ duyệt)

        public string? Notes { get; set; }

        public string? CustomerName { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        // Đã thêm cấu hình decimal để không bị cảnh báo
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}