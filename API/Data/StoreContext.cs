using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// StoreContext kế thừa từ IdentityDbContext với kiểu người dùng là lớp 'User' được định nghĩa riêng
// Nhận tham số cấu hình DbContextOptions và truyền vào base constructor
public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    // DbSet đại diện cho bảng Products trong cơ sở dữ liệu
    public required DbSet<Product> Products { get; set; }

    // DbSet đại diện cho bảng Baskets (giỏ hàng)
    public required DbSet<Basket> Baskets { get; set; }

    // Ghi đè phương thức OnModelCreating để cấu hình thêm khi tạo mô hình dữ liệu
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Gọi phương thức gốc để áp dụng các cấu hình mặc định của Identity
        base.OnModelCreating(builder);

        // Seed dữ liệu sẵn cho bảng IdentityRole (tạo sẵn 2 vai trò: Member và Admin)
        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole
                {
                    Id = "e069461a-10cf-4abf-9930-d070b2a7e40f", // ID duy nhất cho vai trò "Member"
                    Name = "Member",                            // Tên vai trò
                    NormalizedName = "MEMBER"                   // Tên viết hoa dùng cho truy vấn
                },
                new IdentityRole
                {
                    Id = "ed2e9149-fa53-484c-a93f-bd33f9e9fcf6", // ID duy nhất cho vai trò "Admin"
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                }
            );
    }
}
