using System;
using API.Entities;

namespace API.Extensions;

// Lớp mở rộng dành cho IQueryable<Product>, cho phép áp dụng sort, search, và filter trực tiếp trên truy vấn
public static class ProductExtensions
{
    // Phương thức mở rộng để sắp xếp sản phẩm theo tên (mặc định), giá tăng dần, hoặc giảm dần
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        // Sử dụng switch expression để xác định tiêu chí sắp xếp
        query = orderBy switch
        {
            "price" => query.OrderBy(x => x.Price),                  // Sắp xếp theo giá tăng dần
            "priceDesc" => query.OrderByDescending(x => x.Price),   // Sắp xếp theo giá giảm dần
            _ => query.OrderBy(x => x.Name)                          // Mặc định: sắp xếp theo tên
        };

        return query;
    }

    // Phương thức mở rộng để tìm kiếm sản phẩm theo tên (không phân biệt hoa thường)
    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        // Nếu không có từ khóa tìm kiếm, trả về nguyên query
        if (string.IsNullOrEmpty(searchTerm)) return query;

        // Làm sạch và chuyển từ khóa sang chữ thường
        var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

        // Lọc sản phẩm có tên chứa từ khóa
        return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
    }

    // Phương thức mở rộng để lọc sản phẩm theo danh sách thương hiệu (brands) và loại (types)
    public static IQueryable<Product> Filter(this IQueryable<Product> query, 
        string? brands, string? types) 
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        // Nếu có danh sách brands truyền vào, tách chuỗi thành danh sách chữ thường
        if (!string.IsNullOrEmpty(brands))
        {
            brandList.AddRange([.. brands.ToLower().Split(",")]); // Dùng cú pháp spread để gọn hơn
        }

        // Tương tự với types
        if (!string.IsNullOrEmpty(types))
        {
            typeList.AddRange([.. types.ToLower().Split(",")]);
        }

        // Lọc theo brand: nếu không chọn brand nào thì không lọc
        query = query.Where(x => brandList.Count == 0 || brandList.Contains(x.Brand.ToLower()));

        // Lọc theo type: nếu không chọn type nào thì không lọc
        query = query.Where(x => typeList.Count == 0 || typeList.Contains(x.Type.ToLower()));

        return query;
    }
}
