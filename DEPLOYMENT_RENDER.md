# Hướng dẫn Deploy lên Render

## Tổng quan
Project này có 2 phần:
- **Backend (Node.js)**: Thư mục `server-node`
- **Frontend (Angular)**: Thư mục `asm`

## Bước 1: Deploy Backend lên Render

### 1.1 Chuẩn bị Repository
- Đảm bảo code đã được push lên GitHub/GitLab
- File `server-node/render.yaml` đã được tạo (đã có sẵn trong project)

### 1.2 Tạo Web Service trên Render
1. Đăng nhập vào [Render](https://render.com)
2. Nhấn **New +** → **Web Service**
3. Kết nối repository của bạn
4. Render sẽ tự động phát hiện file `render.yaml` trong thư mục `server-node`
5. Nhấn **Create Web Service**

### 1.3 Cấu hình Environment Variables
Sau khi tạo service, bạn cần thêm các biến môi trường:

1. Vào **Settings** → **Environment Variables**
2. Thêm các biến sau:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**Lưu ý**: Để lấy Gmail App Password:
- Vào Google Account → Security → 2-Step Verification → App passwords
- Tạo app password mới và copy vào biến môi trường

### 1.4 Database
Render sẽ tự động tạo MySQL database dựa trên cấu hình trong `render.yaml`. Không cần cấu hình thủ công.

## Bước 2: Deploy Frontend lên Render

### 2.1 Build Angular
Trong thư mục `asm`:
```bash
npm install
npm run build
```

### 2.2 Deploy Static Site
Có 2 cách:

**Cách 1: Deploy lên Render Static Site**
1. Tạo folder `dist` từ build Angular
2. Deploy folder `dist/asm` lên Render Static Site

**Cách 2: Serve từ Backend**
Để đơn giản hơn, bạn có thể serve Angular app từ backend:
1. Build Angular: `cd asm && npm run build`
2. Copy folder `dist/asm` vào `server-node/public`
3. Update `server-node/src/index.js` để serve static files

## Bước 3: Kết nối Frontend và Backend

Sau khi deploy, cập nhật API URL trong frontend:

File: `asm/src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.onrender.com'
};
```

## Cấu hình Render Dashboard (như trong ảnh)

Nếu bạn muốn cấu hình thủ công thay vì dùng `render.yaml`:

### Settings cho Web Service:
- **Name**: laptop-store-backend
- **Region**: Singapore (hoặc gần bạn nhất)
- **Root Directory**: `server-node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (512 MB RAM, 0.1 CPU)

### Environment Variables:
- `NODE_ENV`: `production`
- `PORT`: `3001`
- `JWT_SECRET`: (Render sẽ tự động generate)
- `EMAIL_HOST`: `smtp.gmail.com`
- `EMAIL_PORT`: `587`
- `EMAIL_USER`: `your-email@gmail.com`
- `EMAIL_PASSWORD`: `your-app-password`

### Database:
- Tạo MySQL database trên Render
- Render sẽ tự động inject các biến môi trường:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASSWORD`

## Kiểm tra Deployment

1. Kiểm tra logs trong Render dashboard
2. Test API endpoints
3. Kiểm tra kết nối database
4. Test chức năng forgot password (email)

## Lưu ý quan trọng

1. **Free tier limitations**:
   - Free instance sẽ sleep sau 15 phút không hoạt động
   - Lần request đầu tiên sẽ mất ~30s để wake up
   - MySQL free tier có 90 ngày trial

2. **Database sync**:
   - Database sẽ tự động sync bảng `password_reset_otp`
   - Các bảng khác cần được tạo thủ công hoặc import từ local

3. **File uploads**:
   - Render free tier không lưu trữ file vĩnh viễn
   - Nên dùng S3 hoặc Cloudinary cho production
   - Hiện tại file upload sẽ bị mất khi deploy lại

## Troubleshooting

### Lỗi build:
- Kiểm tra `package.json` có đúng scripts không
- Đảm bảo tất cả dependencies được cài đặt

### Lỗi database:
- Kiểm tra database đã được tạo chưa
- Kiểm tra environment variables có đúng không

### Lỗi email:
- Đảm bảo Gmail App Password đúng
- Kiểm tra 2-Step Verification đã bật chưa

## Next Steps

Sau khi deploy thành công:
1. Test tất cả API endpoints
2. Test đăng ký/đăng nhập
3. Test đặt hàng
4. Test forgot password
5. Deploy frontend
6. Update CORS nếu cần
