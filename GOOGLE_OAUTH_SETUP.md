# Hướng dẫn cấu hình Google OAuth

## 1. Tạo Google OAuth Credentials

### Bước 1: Truy cập Google Cloud Console

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn

### Bước 2: Bật Google+ API

1. Vào "APIs & Services" > "Library"
2. Tìm và bật "Google+ API" hoặc "Google Identity API"

### Bước 3: Tạo OAuth 2.0 Credentials

1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Chọn "Web application"
4. Điền thông tin:
   - **Name**: Medical Booking App
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (cho development)
     - `https://yourdomain.com` (cho production)
   - **Authorized redirect URIs**:
     - `http://localhost:5173` (cho development)
     - `https://yourdomain.com` (cho production)

### Bước 4: Lấy Client ID và Client Secret

- Copy **Client ID** và **Client Secret** từ credentials vừa tạo

## 2. Cấu hình Backend

### Tạo file .env trong thư mục BE-Online-Medical-Booking:

```env
# Database Configuration
DB_SERVER=localhost
DB_DATABASE=FINAL_ONLINE_MEDICAL_BOOKING_DATA
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 3. Cấu hình Frontend

### Cập nhật Client ID trong main.js:

```javascript
// Trong file src/main.js
app.use(vue3GoogleLogin, {
  clientId: "YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
});
```

## 4. Cập nhật Database

### Chạy SQL script để thêm các cột cần thiết:

```sql
-- Chạy file SQL_thesis/add_google_login_columns.sql
```

## 5. Kiểm tra hoạt động

1. Khởi động backend: `npm start`
2. Khởi động frontend: `npm run dev`
3. Truy cập trang đăng nhập và thử đăng nhập bằng Google

## Lưu ý quan trọng

- **Client ID**: Phải khớp giữa frontend và backend
- **Authorized origins**: Phải bao gồm domain thực tế của ứng dụng
- **HTTPS**: Trong production, phải sử dụng HTTPS
- **Security**: Không commit file .env lên git
- **Database**: Đảm bảo đã chạy SQL script để cập nhật cấu trúc database
- **Bảng ACCOUNTS**: Ứng dụng sử dụng bảng ACCOUNTS thay vì Users
