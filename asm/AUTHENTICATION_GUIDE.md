# Hướng dẫn sử dụng hệ thống đăng ký/đăng nhập

## Tính năng đã hoàn thành

### 1. Trang Đăng ký (`/dang-ky`)
- Form đăng ký với các trường:
  - Họ và tên
  - Email
  - Mật khẩu
  - Xác nhận mật khẩu
- Validation:
  - Kiểm tra các trường bắt buộc
  - Kiểm tra mật khẩu khớp
  - Kiểm tra độ dài mật khẩu (tối thiểu 6 ký tự)
  - Kiểm tra email đã tồn tại
- Hiển thị trạng thái loading khi đang xử lý
- Thông báo Material Snackbar
- Chuyển hướng tự động đến trang đăng nhập sau khi đăng ký thành công

### 2. Trang Đăng nhập (`/dang-nhap`)
- Form đăng nhập với:
  - Email
  - Mật khẩu
- Validation:
  - Kiểm tra các trường bắt buộc
  - So sánh mật khẩu với bcrypt
- Hiển thị trạng thái loading
- Lưu thông tin user vào localStorage
- Chuyển hướng về trang chủ sau khi đăng nhập thành công

### 3. Header động
- Hiển thị nút "Đăng nhập" khi chưa đăng nhập
- Hiển thị tên người dùng và nút "Đăng xuất" khi đã đăng nhập
- Số lượng sản phẩm trong giỏ hàng

### 4. Backend API
- `POST /api/dangky` - Đăng ký tài khoản mới
  - Mã hóa mật khẩu với bcrypt
  - Kiểm tra email trùng lặp
- `POST /api/dangnhap` - Đăng nhập
  - So sánh mật khẩu với bcrypt
  - Trả về thông tin user

### 5. AuthService
- `register()` - Gọi API đăng ký
- `login()` - Gọi API đăng nhập và lưu user
- `logout()` - Xóa user và chuyển về trang chủ
- `getUser()` - Lấy thông tin user hiện tại
- `isLoggedIn()` - Kiểm tra trạng thái đăng nhập
- Tự động load user từ localStorage khi khởi động

## Cách test

### Test đăng ký:
1. Mở trình duyệt: `http://localhost:4200/dang-ky`
2. Điền thông tin:
   - Họ tên: Nguyễn Văn A
   - Email: test@example.com
   - Mật khẩu: 123456
   - Xác nhận mật khẩu: 123456
3. Click "ĐĂNG KÝ TÀI KHOẢN"
4. Kiểm tra thông báo thành công
5. Tự động chuyển đến trang đăng nhập

### Test đăng nhập:
1. Mở: `http://localhost:4200/dang-nhap`
2. Điền:
   - Email: test@example.com
   - Mật khẩu: 123456
3. Click "ĐĂNG NHẬP"
4. Kiểm tra thông báo "Xin chào Nguyễn Văn A!"
5. Header hiển thị tên và nút đăng xuất
6. Tự động chuyển về trang chủ

### Test đăng xuất:
1. Click nút "Đăng xuất" ở header
2. Header quay lại hiển thị nút "Đăng nhập"
3. Chuyển về trang chủ

## Files đã chỉnh sửa

### Frontend:
- `asm/src/app/dang-ky/dang-ky.ts` - Component đăng ký
- `asm/src/app/dang-ky/dang-ky.html` - Template đăng ký với form binding
- `asm/src/app/dang-nhap/dang-nhap.ts` - Component đăng nhập
- `asm/src/app/dang-nhap/dang-nhap.html` - Template đăng nhập với form binding
- `asm/src/app/header/header.ts` - Header với auth state
- `asm/src/app/header/header.html` - Header template với user display
- `asm/src/app/services/auth.ts` - Service quản lý authentication

### Backend:
- `server-node/src/index.js` - API endpoints đăng ký/đăng nhập

## Lưu ý
- Mật khẩu được mã hóa bằng bcrypt trước khi lưu vào database
- Thông tin user được lưu trong localStorage để duy trì session
- Tất cả form đều có validation và hiển thị thông báo bằng Material Snackbar
- Form có trạng thái loading để tránh submit nhiều lần
