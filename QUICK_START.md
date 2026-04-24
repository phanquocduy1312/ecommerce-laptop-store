# Quick Start Guide

## Push to GitHub (3 Simple Steps)

### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `ecommerce-laptop-store`
3. Click "Create repository" (don't add README, .gitignore, or license)

### Step 2: Connect Your Local Repository
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-laptop-store.git
```

### Step 3: Push Your Code
```bash
git push -u origin master
```

**Note**: Use a Personal Access Token (not password) when prompted. Create one at:
https://github.com/settings/tokens

---

## Run the Application Locally

### Backend Server
```bash
cd server-node
npm install
# Configure .env file with your database credentials
npm start
```
Server runs on: http://localhost:3000

### Frontend Application
```bash
cd asm
npm install
npm start
```
Application runs on: http://localhost:4200

---

## Environment Setup

Create `server-node/.env` file:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=laptop_node
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## Project Overview

**Full-stack E-Commerce Laptop Store**
- Frontend: Angular 21 + Material UI
- Backend: Node.js + Express + MySQL
- Features: Authentication, Shopping Cart, Admin Dashboard, Order Management

**Key Features:**
✅ User registration and login
✅ Product browsing and search
✅ Shopping cart functionality
✅ Checkout and order processing
✅ Admin panel for management
✅ News section with rich text editor
✅ Password recovery via email
✅ Responsive design

---

For detailed instructions, see:
- `README.md` - Complete project documentation
- `GITHUB_SETUP.md` - Detailed GitHub setup guide
- `asm/AUTHENTICATION_GUIDE.md` - Authentication system details
