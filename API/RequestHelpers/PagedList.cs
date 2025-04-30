using System;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers;

// Lớp PagedList kế thừa từ List<T> — danh sách dữ liệu kiểu T
public class PagedList<T> : List<T>
{
    // Constructor: khởi tạo danh sách phân trang
    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        // Tạo metadata chứa thông tin phân trang
        Metadata = new PaginationMetadata
        {
            TotalCount = count, // Tổng số item trong truy vấn gốc
            PageSize = pageSize, // Kích thước mỗi trang
            CurrentPage = pageNumber, // Trang hiện tại
            TotalPages = (int)Math.Ceiling(count / (double)pageSize) // Tổng số trang
        };

        // Thêm danh sách item vào PagedList
        AddRange(items);
    }

    // Metadata chứa thông tin liên quan đến phân trang
    public PaginationMetadata Metadata { get; set; }

    // Phương thức tạo danh sách phân trang từ một IQueryable<T>
    public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, 
        int pageNumber, int pageSize)
    {
        // Đếm tổng số bản ghi
        var count = await query.CountAsync();

        // Truy vấn bản ghi thuộc trang hiện tại (bỏ qua và lấy số lượng cần thiết)
        var items = await query.Skip((pageNumber - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        // Trả về một đối tượng PagedList chứa danh sách và metadata
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
