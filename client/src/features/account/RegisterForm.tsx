import { useForm } from "react-hook-form";
import { useRegisterMutation } from "./accountAPI"
import { registerSchema, RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutlined } from "@mui/icons-material";
import { Container, Paper, Box, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";

// Component React để hiển thị form đăng ký người dùng
export default function RegisterForm() {
    // Sử dụng hook từ RTK Query để gọi API đăng ký người dùng
    const [registerUser] = useRegisterMutation();

    // Khởi tạo form với React Hook Form, sử dụng schema validation từ Zod
    const {
        register, // Hàm để đăng ký các input vào form
        handleSubmit, // Hàm xử lý khi form được submit
        setError, // Hàm để thiết lập lỗi cho các trường
        formState: { errors, isValid, isSubmitting } // Trạng thái của form
    } = useForm<RegisterSchema>({
        mode: 'onTouched', // Kiểm tra validation khi trường được chạm vào
        resolver: zodResolver(registerSchema) // Sử dụng Zod để xác thực dữ liệu
    });

    // Hàm xử lý khi form được submit
    const onSubmit = async (data: RegisterSchema) => {
        try {
            // Gọi API đăng ký người dùng
            await registerUser(data).unwrap();
        } catch (error) {
            const apiError = error as { message: string };
            if (apiError.message && typeof apiError.message === 'string') {
                // Giả sử lỗi trả về là chuỗi, tách thành mảng các lỗi
                const errorArray = apiError.message.split(',');

                // Duyệt qua từng lỗi và gán vào trường tương ứng
                errorArray.forEach(e => {
                    if (e.includes('Password')) {
                        setError('password', { message: e });
                    } else if (e.includes('Email')) {
                        setError('email', { message: e });
                    }
                });
            }
        }
    };

    return (
        // Container để bao bọc form, sử dụng Material UI
        <Container component={Paper} maxWidth='sm' sx={{ borderRadius: 3 }}>
            <Box display='flex' flexDirection='column' alignItems='center' marginTop='8'>
                {/* Icon khóa để biểu thị đăng ký */}
                <LockOutlined sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }} />
                <Typography variant="h5">
                    Register
                </Typography>
                {/* Form đăng ký */}
                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)} // Gắn hàm xử lý submit
                    width='100%'
                    display='flex'
                    flexDirection='column'
                    gap={3}
                    marginY={3}
                >
                    {/* Trường nhập Email */}
                    <TextField
                        fullWidth
                        label='Email'
                        autoFocus
                        {...register('email')} // Đăng ký trường email vào form
                        error={!!errors.email} // Hiển thị lỗi nếu có
                        helperText={errors.email?.message} // Hiển thị thông báo lỗi
                    />
                    {/* Trường nhập Password */}
                    <TextField
                        fullWidth
                        label='Password'
                        type="password"
                        {...register('password')} // Đăng ký trường password vào form
                        error={!!errors.password} // Hiển thị lỗi nếu có
                        helperText={errors.password?.message} // Hiển thị thông báo lỗi
                    />
                    {/* Nút submit */}
                    <Button disabled={isSubmitting || !isValid} variant="contained" type="submit">
                        Register
                    </Button>
                    {/* Liên kết đến trang đăng nhập nếu đã có tài khoản */}
                    <Typography sx={{ textAlign: 'center' }}>
                        Already have an account?
                        <Typography sx={{ ml: 2 }} component={Link} to='/login' color='primary'>
                            Sign in here
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
