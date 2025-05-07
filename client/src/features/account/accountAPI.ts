import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { User } from "../../app/models/user";
import { LoginSchema } from "../../lib/schemas/loginSchema";
import { router } from "../../app/routes/Routes";
import { toast } from "react-toastify";

export const accountApi = createApi({
    // Tên reducer slice này trong store
    reducerPath: 'accountApi',
    // Sử dụng custom baseQuery có xử lý lỗi
    baseQuery: baseQueryWithErrorHandling,
    // Tag dùng để kiểm soát caching & re-fetching
    tagTypes: ['UserInfo'],

    // Các endpoint định nghĩa các hành động (API calls)
    endpoints: (builder) => ({

        // Endpoint để đăng nhập
        login: builder.mutation<void, LoginSchema>({
            // Cấu hình yêu cầu API
            query: (creds) => {
                return {
                    url: 'login?useCookies=true', // Gửi đến API login và sử dụng cookies
                    method: 'POST',
                    body: creds // Gửi dữ liệu đăng nhập
                }
            },
            // Gọi khi mutation được thực thi
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    // Đợi mutation hoàn tất
                    await queryFulfilled;
                    // Invalidate tag để buộc re-fetch userInfo
                    dispatch(accountApi.util.invalidateTags(['UserInfo']))
                } catch (error) {
                    // Bắt lỗi nếu mutation thất bại
                    console.log(error);
                }
            }
        }),

        // Endpoint để đăng ký
        register: builder.mutation<void, object>({
            query: (creds) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: creds // Gửi dữ liệu đăng ký
                }
            },
            async onQueryStarted(_, {queryFulfilled}) {
                try {
                    // Đợi mutation hoàn tất
                    await queryFulfilled;
                    // Hiện thông báo thành công
                    toast.success('Registration successful - you can now sign in!');
                    // Chuyển hướng người dùng đến trang đăng nhập
                    router.navigate('/login');
                } catch (error) {
                    // Log lỗi nếu có
                    console.log(error);
                    // Ném lỗi ra để handle ở chỗ gọi mutation
                    throw error;
                }
            }
        }),

        // Endpoint để lấy thông tin người dùng đang đăng nhập
        userInfo: builder.query<User, void>({
            query: () => 'account/user-info', // Gọi API lấy thông tin user
            providesTags: ['UserInfo'] // Gắn tag để quản lý cache
        }),

        // Endpoint để đăng xuất
        logout: builder.mutation({
            query: () => ({
                url: 'account/logout',
                method: 'POST' // Gửi yêu cầu POST để logout
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                // Đợi logout hoàn tất
                await queryFulfilled;
                // Invalidate tag để reset thông tin user
                dispatch(accountApi.util.invalidateTags(['UserInfo']));
                // Điều hướng về trang chủ
                router.navigate('/');
            }
        })
    })
});

// Export các custom hook auto-generated bởi RTK Query để sử dụng trong component
export const {
    useLoginMutation,       // Hook dùng để gọi API login
    useRegisterMutation,    // Hook dùng để gọi API register
    useLogoutMutation,      // Hook dùng để gọi API logout
    useUserInfoQuery,       // Hook dùng để gọi API lấy user info ngay khi render
    useLazyUserInfoQuery    // Hook dùng để gọi API lấy user info theo yêu cầu (lazy load)
} = accountApi;