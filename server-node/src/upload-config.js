import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục uploads nếu chưa có
const uploadDirCategories = path.join(__dirname, '../public/uploads/categories');
const uploadDirProducts = path.join(__dirname, '../public/uploads/products');
const uploadDirNews = path.join(__dirname, '../public/uploads/news');

if (!fs.existsSync(uploadDirCategories)) {
  fs.mkdirSync(uploadDirCategories, { recursive: true });
}

if (!fs.existsSync(uploadDirProducts)) {
  fs.mkdirSync(uploadDirProducts, { recursive: true });
}

if (!fs.existsSync(uploadDirNews)) {
  fs.mkdirSync(uploadDirNews, { recursive: true });
}

// Cấu hình storage cho categories
const storageCategories = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirCategories);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// Cấu hình storage cho products
const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirProducts);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// Filter chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'), false);
  }
};

export const upload = multer({
  storage: storageCategories,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const uploadProduct = multer({
  storage: storageProducts,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Cấu hình storage cho news
const storageNews = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirNews);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

export const uploadNews = multer({
  storage: storageNews,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Hàm xóa file
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Lỗi xóa file:', error);
    return false;
  }
};
