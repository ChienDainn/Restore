// Import các namespace cần thiết
using System;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// Controller quản lý tài khoản người dùng
public class AccountController(SignInManager<User> signInManager) : BaseApiController
{
    // Đăng ký người dùng mới
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        // Tạo user mới với username và email từ DTO
        var user = new User { UserName = registerDto.Email, Email = registerDto.Email };

        // Tạo user trong cơ sở dữ liệu với mật khẩu được mã hóa
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        // Nếu có lỗi, thêm lỗi vào ModelState để trả về cho client
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(); // Trả về lỗi validation 400
        }

        // Gán vai trò "Member" cho user mới tạo
        await signInManager.UserManager.AddToRoleAsync(user, "Member");

        return Ok(); // Trả về 200 OK khi đăng ký thành công
    }

    // Lấy thông tin người dùng hiện tại
    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        // Nếu chưa đăng nhập thì trả về 204 No Content
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        // Lấy user hiện tại từ ClaimsPrincipal
        var user = await signInManager.UserManager.GetUserAsync(User);

        if (user == null) return Unauthorized(); // Nếu user không tồn tại thì trả về 401

        // Lấy danh sách các vai trò của user
        var roles = await signInManager.UserManager.GetRolesAsync(user);

        // Trả về thông tin user và role
        return Ok(new
        {
            user.Email,
            user.UserName,
            Roles = roles
        });
    }

    // Đăng xuất user
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync(); // Xoá cookie hoặc token đăng nhập

        return NoContent(); // Trả về 204 No Content
    }

    // Thêm hoặc cập nhật địa chỉ người dùng (yêu cầu đăng nhập)
    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdateAddress(Address address)
    {
        // Tìm user hiện tại và bao gồm cả địa chỉ (eager loading)
        var user = await signInManager.UserManager.Users
            .Include(x => x.Address)
            .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);

        if (user == null) return Unauthorized(); // Nếu không tìm thấy user thì trả về 401

        user.Address = address; // Gán địa chỉ mới

        // Cập nhật user trong cơ sở dữ liệu
        var result = await signInManager.UserManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest("Problem updating user address");

        return Ok(user.Address); // Trả về địa chỉ đã lưu
    }

    // Lấy địa chỉ đã lưu của user (yêu cầu đăng nhập)
    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetSavedAddress()
    {
        // Lấy địa chỉ user hiện tại thông qua truy vấn LINQ
        var address = await signInManager.UserManager.Users
            .Where(x => x.UserName == User.Identity!.Name)
            .Select(x => x.Address)
            .FirstOrDefaultAsync();

        if (address == null) return NoContent(); // Nếu chưa có địa chỉ thì trả về 204

        return address; // Trả về địa chỉ
    }
}
