using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // Controller xử lý các yêu cầu liên quan đến sản phẩm
    public class ProductsController(StoreContext context) : BaseApiController
    {
        // Lấy danh sách sản phẩm có hỗ trợ phân trang, tìm kiếm, sắp xếp và lọc
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(
            [FromQuery] ProductParams productParams) // Nhận các tham số từ query string
        {
            // Tạo truy vấn IQueryable để áp dụng các bộ lọc
            var query = context.Products
                .Sort(productParams.OrderBy)                   // Sắp xếp theo tên hoặc giá
                .Search(productParams.SearchTerm)              // Tìm kiếm theo từ khóa
                .Filter(productParams.Brands, productParams.Types) // Lọc theo brand và type
                .AsQueryable();                                // Biến thành truy vấn IQueryable

            // Áp dụng phân trang cho truy vấn
            var products = await PagedList<Product>.ToPagedList(query, 
                productParams.PageNumber, productParams.PageSize);

            // Thêm thông tin phân trang vào header của response
            Response.AddPaginationHeader(products.Metadata);

            return products; // Trả về danh sách sản phẩm đã phân trang
        }

        // Lấy thông tin chi tiết của một sản phẩm theo id
        [HttpGet("{id}")] // Đường dẫn: api/products/2
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id); // Tìm sản phẩm theo id

            if (product == null) return NotFound(); // Nếu không tìm thấy thì trả về 404

            return product; // Trả về sản phẩm
        }

        // Lấy danh sách các brand và type để hiển thị filter ở giao diện
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters() 
        {
            // Lấy danh sách brand duy nhất
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            // Lấy danh sách type duy nhất
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new { brands, types }); // Trả về object chứa cả hai danh sách
        }
    }
}
