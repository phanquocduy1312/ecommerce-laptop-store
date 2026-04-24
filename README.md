# E-Commerce Laptop Store

A full-stack e-commerce web application for selling laptops, built with Angular 21 and Node.js/Express. This project features a modern shopping experience with user authentication, product management, shopping cart, order processing, and an admin dashboard.

## 🚀 Features

### Customer Features
- **Product Browsing**: View products by categories (Gaming Laptops, Office Laptops, etc.)
- **Product Search & Filter**: Search and filter products by various criteria
- **Shopping Cart**: Add/remove products, update quantities
- **User Authentication**: Register, login, logout, and password recovery
- **User Profile**: View and update personal information and order history
- **Checkout Process**: Complete orders with address management
- **News Section**: Read latest tech news and articles
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of sales, orders, and statistics
- **Product Management**: CRUD operations for products with image upload
- **Category Management**: Manage product categories
- **Order Management**: View and process customer orders
- **User Management**: Manage customer accounts
- **News Management**: Create and manage news articles with rich text editor (CKEditor)

## 🛠️ Tech Stack

### Frontend (asm/)
- **Framework**: Angular 21.2
- **UI Components**: Angular Material
- **Rich Text Editor**: CKEditor 5
- **Styling**: CSS3
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: RxJS

### Backend (server-node/)
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MySQL with Sequelize ORM
- **Authentication**: bcrypt for password hashing
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Environment Variables**: dotenv
- **CORS**: Enabled for cross-origin requests

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MySQL** (v8 or higher)
- **Angular CLI** (v21 or higher): `npm install -g @angular/cli`

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE laptop_store;
```

2. Import the database schema (if you have a SQL dump file) or let Sequelize create tables automatically

3. Update database credentials in `server-node/.env`

### 3. Backend Setup

```bash
# Navigate to server directory
cd server-node

# Install dependencies
npm install

# Create .env file with the following variables:
# DB_HOST=localhost
# DB_USER=your_mysql_username
# DB_PASSWORD=your_mysql_password
# DB_NAME=laptop_store
# DB_PORT=3306
# PORT=3000
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_password

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:3000`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd asm

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will run on `http://localhost:4200`

## 🚀 Running the Application

### Development Mode

1. **Start Backend Server**:
```bash
cd server-node
npm run dev
```

2. **Start Frontend Application** (in a new terminal):
```bash
cd asm
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

### Production Build

```bash
# Build frontend
cd asm
npm run build

# The build artifacts will be stored in the dist/ directory
```

## 📁 Project Structure

```
.
├── asm/                          # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/           # Admin panel components
│   │   │   ├── services/        # Angular services
│   │   │   ├── guards/          # Route guards
│   │   │   ├── home/            # Home page
│   │   │   ├── products/        # Product listing
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── check-out/       # Checkout process
│   │   │   ├── profile/         # User profile
│   │   │   ├── dang-nhap/       # Login page
│   │   │   ├── dang-ky/         # Registration page
│   │   │   └── ...              # Other components
│   │   ├── environments/        # Environment configurations
│   │   └── styles.css           # Global styles
│   ├── package.json
│   └── angular.json
│
└── server-node/                  # Node.js backend server
    ├── src/
    │   ├── index.js             # Main server file
    │   ├── database.js          # Database configuration
    │   ├── email-config.js      # Email service configuration
    │   ├── upload-config.js     # File upload configuration
    │   └── forgot-password-api.js # Password recovery API
    ├── uploads/                 # Uploaded files directory
    ├── package.json
    └── .env                     # Environment variables
```

## 🔐 Default Admin Credentials

After setting up the database, you may need to create an admin account manually or use these default credentials (if seeded):

- **Email**: admin@example.com
- **Password**: admin123

## 📝 API Endpoints

### Authentication
- `POST /api/dangky` - User registration
- `POST /api/dangnhap` - User login
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

### Products
- `GET /api/sanpham` - Get all products
- `GET /api/sanpham/:id` - Get product by ID
- `POST /api/sanpham` - Create product (Admin)
- `PUT /api/sanpham/:id` - Update product (Admin)
- `DELETE /api/sanpham/:id` - Delete product (Admin)

### Categories
- `GET /api/loai` - Get all categories
- `POST /api/loai` - Create category (Admin)
- `PUT /api/loai/:id` - Update category (Admin)
- `DELETE /api/loai/:id` - Delete category (Admin)

### Orders
- `GET /api/donhang` - Get all orders (Admin)
- `GET /api/donhang/user/:userId` - Get user orders
- `POST /api/donhang` - Create order
- `PUT /api/donhang/:id` - Update order status (Admin)

### News
- `GET /api/tintuc` - Get all news
- `GET /api/tintuc/:id` - Get news by ID
- `POST /api/tintuc` - Create news (Admin)
- `PUT /api/tintuc/:id` - Update news (Admin)
- `DELETE /api/tintuc/:id` - Delete news (Admin)

## 🧪 Testing

```bash
# Frontend tests
cd asm
npm test

# Backend tests (if configured)
cd server-node
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Phan Quoc Duy** - PS44695

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Express.js for the backend framework
- CKEditor for the rich text editor
- Angular Material for UI components

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Note**: Make sure to update the `.env` file with your actual credentials before running the application. Never commit sensitive information like passwords or API keys to version control.
