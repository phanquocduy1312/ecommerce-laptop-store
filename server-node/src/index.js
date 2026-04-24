import { SanPhamModel, LoaiModel, DonHangModel, DonHangChiTietModel, UserModel, ThuocTinhModel, TinTucModel, LoaiTinModel, syncDatabase, sequelize } from "./database.js";
import cors from 'cors';
import express from "express";
import { Op, Sequelize } from "sequelize";
import bcrypt from 'bcrypt';
import { sendOTP, verifyOTP, resetPassword } from './forgot-password-api.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import dotenv from 'dotenv'
import jwt from 'node-jsonwebtoken'
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // cho phép đọc dữ liệu dạng json
app.use(cors()); // cho phép Angular và Vite request đến backend

// Đồng bộ database khi khởi động
syncDatabase();

// --- Routes ---
// ============================================
// API DASHBOARD STATS
// ============================================
app.post('/api/dangnhapadmin', async (req, res) => {
    const { email, mat_khau } = req.body
    const user = await UserModel.findOne({ where: { email: email } })
    if (!user) {
        return res.status(404).json({ thong_bao: "Email không tồn tại" })
    }
    let mk_mahoa = user.mat_khau
    let kq = bcrypt.compareSync(mat_khau, mk_mahoa)
    if (!kq) {
        return res.json({ thong_bao: "Mật khẩu không đungs" })
    }
    if (user.vai_tro != 1) {
        return res.status(401).json({ thong_bao: "Bạn không phải là admin" })
    }
    if (user.khoa == 1) {
        return res.status(401).json({ thong_bao: "Tài khoản của bạn đã bị khoá" })
    }
    // tạo token
    const payload = { id: user.id, email: user.email }
    const maxAge = '1h'
    const bearToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: maxAge })
    res.status(200).json({
        token: bearToken, expiresIn: maxAge,
        info: { id: user.id, ho_ten: user.ho_ten, email: user.email, vai_tro: user.vai_tro }
    })
})
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        // Tổng số đơn hàng
        const totalOrders = await DonHangModel.count();

        // Đơn chờ xử lý
        const pendingOrders = await DonHangModel.count({ where: { trang_thai: 0 } });

        // Đơn hoàn thành
        const completedOrders = await DonHangModel.count({ where: { trang_thai: 3 } });

        // Tổng doanh thu (chỉ tính đơn hoàn thành)
        const revenueResult = await DonHangModel.sum('tong_tien', { where: { trang_thai: 3 } });
        const totalRevenue = revenueResult || 0;

        // Tổng sản phẩm
        const totalProducts = await SanPhamModel.count();

        // Tổng danh mục
        const totalCategories = await LoaiModel.count();

        // Tổng người dùng
        const totalUsers = await UserModel.count();

        // 10 đơn hàng gần đây
        const recentOrders = await DonHangModel.findAll({
            order: [['thoi_diem_mua', 'DESC']],
            limit: 10,
            attributes: ['id', 'ho_ten', 'email', 'tong_tien', 'trang_thai', 'thoi_diem_mua']
        });

        // Top 5 sản phẩm bán chạy - query thủ công
        const topProductsQuery = `
            SELECT 
                dhct.id_sp,
                SUM(dhct.so_luong) as total_sold,
                SUM(dhct.so_luong * dhct.gia) as revenue,
                sp.ten_sp,
                sp.hinh
            FROM don_hang_chi_tiet dhct
            INNER JOIN san_pham sp ON dhct.id_sp = sp.id
            GROUP BY dhct.id_sp, sp.ten_sp, sp.hinh
            ORDER BY total_sold DESC
            LIMIT 5
        `;

        const [topProducts] = await sequelize.query(topProductsQuery);

        res.json({
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue: Number(totalRevenue),
            totalProducts,
            totalCategories,
            totalUsers,
            recentOrders,
            topProducts,
            revenueByMonth: []
        });
    } catch (error) {
        console.error('Lỗi lấy dashboard stats:', error);
        res.status(500).json({ "thong_bao": "Lỗi lấy thống kê", "error": error.message });
    }
});

// ============================================
// API ĐƠN HÀNG
// ============================================

// Lấy tất cả đơn hàng (Admin - có phân trang)
app.get('/api/donhang/admin', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 15;
        const offset = (page - 1) * limit;

        const { count, rows } = await DonHangModel.findAndCountAll({
            order: [['thoi_diem_mua', 'DESC']],
            limit: limit,
            offset: offset,
            include: [{
                model: DonHangChiTietModel,
                as: 'chi_tiet',
                include: [{
                    model: SanPhamModel,
                    as: 'san_pham',
                    attributes: ['id', 'ten_sp', 'hinh']
                }]
            }]
        });

        res.json({
            orders: rows,
            total: count,
            page: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách đơn hàng:', error);
        res.status(500).json({ "thong_bao": "Lỗi lấy danh sách đơn hàng", "error": error.message });
    }
});

// Cập nhật trạng thái đơn hàng
app.put('/api/donhang/:id/status', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { trang_thai } = req.body;

        const order = await DonHangModel.findByPk(id);
        if (!order) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy đơn hàng" });
        }

        await order.update({ trang_thai: trang_thai });

        res.json({
            "thong_bao": "Cập nhật trạng thái thành công",
            "order": order
        });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        res.status(500).json({ "thong_bao": "Lỗi cập nhật trạng thái", "error": error.message });
    }
});

// Xóa đơn hàng
app.delete('/api/donhang/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const order = await DonHangModel.findByPk(id);
        if (!order) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy đơn hàng" });
        }

        // Xóa chi tiết đơn hàng trước
        await DonHangChiTietModel.destroy({ where: { id_dh: id } });

        // Xóa đơn hàng
        await order.destroy();

        res.json({ "thong_bao": "Xóa đơn hàng thành công" });
    } catch (error) {
        console.error('Lỗi xóa đơn hàng:', error);
        res.status(500).json({ "thong_bao": "Lỗi xóa đơn hàng", "error": error.message });
    }
});

// Tạo đơn hàng mới (checkout)
app.post('/api/donhang', async (req, res) => {
    try {
        const { ho_ten, email, dien_thoai, dia_chi, ghi_chu, tong_tien, chi_tiet } = req.body;

        // Validate
        if (!ho_ten || !email || !dien_thoai || !dia_chi) {
            return res.status(400).json({ "thon`g_bao": "Vui lòng điền đầy đủ thông tin" });
        }

        if (!chi_tiet || chi_tiet.length === 0) {
            return res.status(400).json({ "thong_bao": "Đơn hàng không có sản phẩm" });
        }

        // Tạo đơn hàng
        const donHang = await DonHangModel.create({
            ho_ten: ho_ten,
            email: email,
            dien_thoai: dien_thoai || '',
            dia_chi: dia_chi || '',
            ghi_chu: ghi_chu || '',
            tong_tien: tong_tien || 0,
            trang_thai: 0 // 0: Chờ xử lý
        });

        // Tạo chi tiết đơn hàng
        const chiTietPromises = chi_tiet.map(item => {
            return DonHangChiTietModel.create({
                id_dh: donHang.id,
                id_sp: item.id_sp,
                so_luong: item.so_luong,
                gia: item.gia
            });
        });

        await Promise.all(chiTietPromises);

        console.log('Đơn hàng mới:', donHang.id, '-', ho_ten);

        res.json({
            "thong_bao": "Đặt hàng thành công",
            "don_hang": {
                id: donHang.id,
                ho_ten: donHang.ho_ten,
                email: donHang.email,
                tong_tien: donHang.tong_tien
            }
        });
    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({ "thong_bao": "Lỗi tạo đơn hàng", "error": error.message });
    }
});

// API cũ (giữ lại để tương thích)
app.post('/api/luudonhang/', async (req, res) => {
    let { ho_ten, email, ghi_chu } = req.body
    await DonHangModel.create({
        ho_ten: ho_ten, email: email, ghi_chu: ghi_chu
    })
        .then(function (item) {
            res.json({ "thong_bao": "Đã tạo đơn hàng", "dh": item });
        })
        .catch(function (err) {
            res.json({ "thong_bao": "Lỗi tạo đơn hàng", err })
        });
});

// Lấy danh sách đơn hàng theo email
app.get('/api/donhang/user/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const orders = await DonHangModel.findAll({
            where: { email: email },
            order: [['thoi_diem_mua', 'DESC']],
            include: [{
                model: DonHangChiTietModel,
                as: 'chi_tiet',
                include: [{
                    model: SanPhamModel,
                    as: 'san_pham',
                    attributes: ['id', 'ten_sp', 'hinh', 'gia']
                }]
            }]
        });

        res.json(orders);
    } catch (error) {
        console.error('Lỗi lấy đơn hàng:', error);
        res.status(500).json({ "thong_bao": "Lỗi lấy đơn hàng", "error": error.message });
    }
});

// Lấy chi tiết một đơn hàng
app.get('/api/donhang/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const order = await DonHangModel.findOne({
            where: { id: id },
            include: [{
                model: DonHangChiTietModel,
                as: 'chi_tiet',
                include: [{
                    model: SanPhamModel,
                    as: 'san_pham',
                    attributes: ['id', 'ten_sp', 'hinh', 'gia', 'gia_km']
                }]
            }]
        });

        if (!order) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        console.error('Lỗi lấy chi tiết đơn hàng:', error);
        res.status(500).json({ "thong_bao": "Lỗi lấy chi tiết đơn hàng", "error": error.message });
    }
});


app.post(`/api/dangky`, async (req, res) => {
    try {
        let { email, mat_khau, go_lai_mat_khau, ho_ten } = req.body;

        // Validate
        if (!email || !mat_khau || !ho_ten) {
            return res.status(400).json({ "thong_bao": "Vui lòng điền đầy đủ thông tin" });
        }

        if (mat_khau !== go_lai_mat_khau) {
            return res.status(400).json({ "thong_bao": "Mật khẩu không khớp" });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await UserModel.findOne({ where: { email: email } });
        if (existingUser) {
            console.log('Email đã tồn tại:', email);
            return res.status(400).json({ "thong_bao": "Email đã được sử dụng" });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const mk_mahoa = await bcrypt.hash(mat_khau, salt);

        console.log('Đăng ký user mới:', email);

        // Lưu vào bảng users
        const user = await UserModel.create({
            email: email,
            ho_ten: ho_ten,
            mat_khau: mk_mahoa
        });

        res.json({
            "thong_bao": "Đã lưu users",
            "user": {
                id: user.id,
                email: user.email,
                ho_ten: user.ho_ten
            }
        });
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        res.status(500).json({ "thong_bao": "Lỗi lưu users", "error": err.message });
    }
})

// API Đăng nhập
app.post('/api/dangnhap', async (req, res) => {
    try {
        const { email, mat_khau } = req.body;

        // Validate
        if (!email || !mat_khau) {
            return res.status(400).json({ "thong_bao": "Vui lòng điền đầy đủ thông tin" });
        }

        // Tìm user
        const user = await UserModel.findOne({ where: { email: email } });
        if (!user) {
            console.log('User không tồn tại:', email);
            return res.status(401).json({ "thong_bao": "Email hoặc mật khẩu không đúng" });
        }

        // Kiểm tra tài khoản bị khóa
        if (user.khoa === 1) {
            console.log('Tài khoản bị khóa:', email);
            return res.status(403).json({ "thong_bao": "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." });
        }

        console.log('Đăng nhập - Email:', email);
        console.log('Mật khẩu nhập vào:', mat_khau);
        console.log('Mật khẩu hash trong DB:', user.mat_khau);

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);

        console.log('Kết quả so sánh mật khẩu:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ "thong_bao": "Email hoặc mật khẩu không đúng" });
        }

        // Đăng nhập thành công
        console.log('Đăng nhập thành công:', email);
        res.json({
            "thong_bao": "Đăng nhập thành công",
            "user": {
                id: user.id,
                email: user.email,
                ho_ten: user.ho_ten,
                vai_tro: user.vai_tro
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ "thong_bao": "Lỗi server" });
    }
});

// ============================================
// API QUÊN MẬT KHẨU
// ============================================
app.post('/api/forgot-password/send-otp', sendOTP);
app.post('/api/forgot-password/verify-otp', verifyOTP);
app.post('/api/forgot-password/reset-password', resetPassword);

app.post('/api/luugiohang/', async (req, res) => {
    let { id_dh, id_sp, so_luong } = req.body
    await DonHangChiTietModel.create({
        id_dh: id_dh, id_sp: id_sp, so_luong: so_luong
    })
        .then(function (item) {
            res.json({ "thong_bao": "Đã lưu giỏ hàng", "sp": item });
        })
        .catch(function (err) {
            res.json({ "thong_bao": "Lỗi lưu giỏ hàng ", err })
        });
});

// ============================================
// API QUẢN LÝ DANH MỤC (CRUD)
// ============================================

// Import upload config
import { upload, uploadProduct, uploadNews, deleteFile } from './upload-config.js';
import { info } from "console";

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Lấy tất cả danh mục (cho dropdown, menu)
app.get("/api/loai", async (req, res) => {
    try {
        const loai_arr = await LoaiModel.findAll({
            order: [['thu_tu', 'ASC']],
        });
        res.json(loai_arr);
    } catch (error) {
        res.status(500).json({ "thong_bao": "Lỗi server", error: error.message });
    }
});

// Lấy danh sách danh mục với phân trang (cho admin)
app.get("/api/loai/paginated", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await LoaiModel.findAndCountAll({
            order: [['thu_tu', 'ASC']],
            limit: limit,
            offset: offset
        });

        res.json({
            categories: rows,
            total: count,
            page: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Lấy chi tiết một loại
app.get("/api/loai/:id", async (req, res) => {
    try {
        const loai = await LoaiModel.findByPk(req.params.id);
        if (!loai) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy danh mục" });
        }
        res.json(loai);
    } catch (error) {
        res.status(500).json({ "thong_bao": "Lỗi server", error: error.message });
    }
});

// Thêm danh mục mới (có upload ảnh)
app.post("/api/loai", upload.single('hinh_icon'), async (req, res) => {
    try {
        const { ten_loai, slug, thu_tu, an_hien } = req.body;

        if (!ten_loai) {
            return res.status(400).json({ "thong_bao": "Vui lòng nhập tên hãng" });
        }

        let hinh_icon = '';

        if (req.file) {
            hinh_icon = `/uploads/categories/${req.file.filename}`;
        } else {
            return res.status(400).json({ "thong_bao": "Vui lòng chọn logo" });
        }

        const newCategory = await LoaiModel.create({
            ten_loai,
            hinh_icon,
            slug: slug || ten_loai.toLowerCase().replace(/\s+/g, '-'),
            thu_tu: thu_tu || 1,
            an_hien: an_hien !== undefined ? an_hien : 1
        });

        res.json({
            thong_bao: "Thêm danh mục thành công",
            category: newCategory
        });
    } catch (error) {
        console.error('Lỗi thêm danh mục:', error);
        res.status(500).json({ thong_bao: "Lỗi thêm danh mục", error: error.message });
    }
});

// Cập nhật danh mục (có upload ảnh)
app.put("/api/loai/:id", upload.single('hinh_icon'), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { ten_loai, slug, thu_tu, an_hien } = req.body;

        const category = await LoaiModel.findByPk(id);
        if (!category) {
            return res.status(404).json({ thong_bao: "Không tìm thấy danh mục" });
        }

        let hinh_icon = category.hinh_icon;

        if (req.file) {
            if (category.hinh_icon && category.hinh_icon.startsWith('/uploads/')) {
                const oldFilePath = path.join(__dirname, '../public', category.hinh_icon);
                deleteFile(oldFilePath);
            }

            hinh_icon = `/uploads/categories/${req.file.filename}`;
        }

        await category.update({
            ten_loai: ten_loai || category.ten_loai,
            hinh_icon,
            slug: slug || ten_loai.toLowerCase().replace(/\s+/g, '-'),
            thu_tu: thu_tu !== undefined ? thu_tu : category.thu_tu,
            an_hien: an_hien !== undefined ? an_hien : category.an_hien
        });

        res.json({
            thong_bao: "Cập nhật danh mục thành công",
            category: category
        });
    } catch (error) {
        console.error('Lỗi cập nhật danh mục:', error);
        res.status(500).json({ thong_bao: "Lỗi cập nhật danh mục", error: error.message });
    }
});

// Xóa danh mục
app.delete("/api/loai/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const category = await LoaiModel.findByPk(id);
        if (!category) {
            return res.status(404).json({ thong_bao: "Không tìm thấy danh mục" });
        }

        if (category.hinh_icon && category.hinh_icon.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../public', category.hinh_icon);
            deleteFile(filePath);
        }

        await category.destroy();

        res.json({ thong_bao: "Xóa danh mục thành công" });
    } catch (error) {
        console.error('Lỗi xóa danh mục:', error);
        res.status(500).json({ thong_bao: "Lỗi xóa danh mục", error: error.message });
    }
});

// Lấy sản phẩm hot
app.get("/api/sphot/:sosp", async (req, res) => {
    const sosp = Number(req.params.sosp) || 12;
    const sp_arr = await SanPhamModel.findAll({
        where: { an_hien: 1, hot: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
        offset: 0, limit: sosp,
    });
    res.json(sp_arr);
});

// Lấy sản phẩm mới
app.get("/api/spmoi/:sosp", async (req, res) => {
    const sosp = Number(req.params.sosp) || 6;
    const sp_arr = await SanPhamModel.findAll({
        where: { an_hien: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
        offset: 0, limit: sosp,
    });
    res.json(sp_arr);
});

// Lấy tất cả sản phẩm với phân trang
app.get("/api/sanpham", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        // Build where clause
        const where = { an_hien: 1 };

        // Filter by categories
        if (req.query.categories) {
            const categoryIds = req.query.categories.split(',').map(Number);
            where.id_loai = categoryIds;
        }

        // Filter by price range
        if (req.query.priceRange) {
            const range = req.query.priceRange;
            if (range === 'under20') {
                where.gia = { [Op.lt]: 20000000 };
            } else if (range === '20to40') {
                where.gia = { [Op.between]: [20000000, 40000000] };
            } else if (range === 'over40') {
                where.gia = { [Op.gt]: 40000000 };
            }
        }

        // Search by name
        if (req.query.search) {
            where.ten_sp = { [Op.like]: `%${req.query.search}%` };
        }

        // Determine sort order
        let order = [['ngay', 'DESC']]; // Default: newest
        if (req.query.sort === 'priceAsc') {
            order = [['gia', 'ASC']];
        } else if (req.query.sort === 'priceDesc') {
            order = [['gia', 'DESC']];
        } else if (req.query.sort === 'popular') {
            order = [['luot_xem', 'DESC']];
        }

        const { count, rows } = await SanPhamModel.findAndCountAll({
            where: where,
            include: [{
                model: ThuocTinhModel,
                as: 'thuoc_tinh',
                required: false
            }],
            order: order,
            limit: limit,
            offset: offset
        });

        res.json({
            products: rows,
            total: count,
            page: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// ============================================
// API QUẢN LÝ SẢN PHẨM (ADMIN)
// ============================================

// Lấy danh sách sản phẩm với phân trang (cho admin - không filter an_hien)
app.get("/api/sanpham/paginated", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const { count, rows } = await SanPhamModel.findAndCountAll({
            order: [['ngay', 'DESC']],
            limit: limit,
            offset: offset
        });

        res.json({
            products: rows,
            total: count,
            page: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Thêm sản phẩm mới (có upload ảnh)
app.post("/api/sanpham", uploadProduct.single('hinh'), async (req, res) => {
    try {
        const { ten_sp, gia, gia_km, mo_ta, id_loai, hot, an_hien, specs } = req.body;

        if (!ten_sp || !gia || !id_loai) {
            return res.status(400).json({ "thong_bao": "Vui lòng điền đầy đủ thông tin bắt buộc" });
        }

        let hinh = '';

        if (req.file) {
            hinh = `/uploads/products/${req.file.filename}`;
        } else {
            return res.status(400).json({ "thong_bao": "Vui lòng chọn hình ảnh sản phẩm" });
        }

        const newProduct = await SanPhamModel.create({
            ten_sp,
            gia: Number(gia),
            gia_km: Number(gia_km) || 0,
            hinh,
            mo_ta: mo_ta || '',
            id_loai: Number(id_loai),
            hot: Number(hot) || 0,
            an_hien: an_hien !== undefined ? Number(an_hien) : 1,
            luot_xem: 0,
            ngay: new Date()
        });

        // Thêm thuộc tính nếu có
        if (specs) {
            const specsData = JSON.parse(specs);
            await ThuocTinhModel.create({
                id_sp: newProduct.id,
                cpu: specsData.cpu || '',
                ram: specsData.ram || '',
                gpu: specsData.gpu || '',
                dia_cung: specsData.dia_cung || '',
                man_hinh: specsData.man_hinh || '',
                pin: specsData.pin || '',
                cong_ket_noi: specsData.cong_ket_noi || '',
                mau_sac: specsData.mau_sac || '',
                can_nang: specsData.can_nang || ''
            });
        }

        res.json({
            thong_bao: "Thêm sản phẩm thành công",
            product: newProduct
        });
    } catch (error) {
        console.error('Lỗi thêm sản phẩm:', error);
        res.status(500).json({ thong_bao: "Lỗi thêm sản phẩm", error: error.message });
    }
});

// Cập nhật sản phẩm (có upload ảnh)
app.put("/api/sanpham/:id", uploadProduct.single('hinh'), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { ten_sp, gia, gia_km, mo_ta, id_loai, hot, an_hien, specs } = req.body;

        const product = await SanPhamModel.findByPk(id);
        if (!product) {
            return res.status(404).json({ thong_bao: "Không tìm thấy sản phẩm" });
        }

        let hinh = product.hinh;

        if (req.file) {
            if (product.hinh && product.hinh.startsWith('/uploads/')) {
                const oldFilePath = path.join(__dirname, '../public', product.hinh);
                deleteFile(oldFilePath);
            }

            hinh = `/uploads/products/${req.file.filename}`;
        }

        await product.update({
            ten_sp: ten_sp || product.ten_sp,
            gia: gia !== undefined ? Number(gia) : product.gia,
            gia_km: gia_km !== undefined ? Number(gia_km) : product.gia_km,
            hinh,
            mo_ta: mo_ta !== undefined ? mo_ta : product.mo_ta,
            id_loai: id_loai !== undefined ? Number(id_loai) : product.id_loai,
            hot: hot !== undefined ? Number(hot) : product.hot,
            an_hien: an_hien !== undefined ? Number(an_hien) : product.an_hien
        });

        // Cập nhật thuộc tính
        if (specs) {
            const specsData = JSON.parse(specs);
            const existingSpecs = await ThuocTinhModel.findOne({ where: { id_sp: id } });

            if (existingSpecs) {
                await existingSpecs.update({
                    cpu: specsData.cpu || '',
                    ram: specsData.ram || '',
                    gpu: specsData.gpu || '',
                    dia_cung: specsData.dia_cung || '',
                    man_hinh: specsData.man_hinh || '',
                    pin: specsData.pin || '',
                    cong_ket_noi: specsData.cong_ket_noi || '',
                    mau_sac: specsData.mau_sac || '',
                    can_nang: specsData.can_nang || ''
                });
            } else {
                await ThuocTinhModel.create({
                    id_sp: id,
                    cpu: specsData.cpu || '',
                    ram: specsData.ram || '',
                    gpu: specsData.gpu || '',
                    dia_cung: specsData.dia_cung || '',
                    man_hinh: specsData.man_hinh || '',
                    pin: specsData.pin || '',
                    cong_ket_noi: specsData.cong_ket_noi || '',
                    mau_sac: specsData.mau_sac || '',
                    can_nang: specsData.can_nang || ''
                });
            }
        }

        res.json({
            thong_bao: "Cập nhật sản phẩm thành công",
            product: product
        });
    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error);
        res.status(500).json({ thong_bao: "Lỗi cập nhật sản phẩm", error: error.message });
    }
});

// Xóa sản phẩm
app.delete("/api/sanpham/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const product = await SanPhamModel.findByPk(id);
        if (!product) {
            return res.status(404).json({ thong_bao: "Không tìm thấy sản phẩm" });
        }

        // Xóa thuộc tính trước
        await ThuocTinhModel.destroy({ where: { id_sp: id } });

        if (product.hinh && product.hinh.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../public', product.hinh);
            deleteFile(filePath);
        }

        await product.destroy();

        res.json({ thong_bao: "Xóa sản phẩm thành công" });
    } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error);
        res.status(500).json({ thong_bao: "Lỗi xóa sản phẩm", error: error.message });
    }
});

// Lấy chi tiết một sản phẩm (KÈM THUỘC TÍNH)
app.get("/api/sp/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const sp = await SanPhamModel.findOne({
            where: { id: id },
            include: [{
                model: ThuocTinhModel,
                as: 'thuoc_tinh',
                required: false
            }]
        });

        if (!sp) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json(sp);
    } catch (error) {
        console.error('Lỗi API /api/sp/:id:', error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// Lấy sản phẩm theo loại
app.get("/api/sptrongloai/:id", async (req, res) => {
    const id_loai = Number(req.params.id);
    const sp_arr = await SanPhamModel.findAll({
        where: { id_loai: id_loai, an_hien: 1 },
        order: [['ngay', 'DESC'], ['gia', 'ASC']],
    });
    res.json(sp_arr);
});
app.get("/api/spsale/:sosp", async (req, res) => {
    try {
        const soSp = Number(req.params.sosp) || 5;

        const sp_arr = await SanPhamModel.findAll({
            where: {
                an_hien: 1, // Chỉ lấy sản phẩm đang hiển thị
                gia_km: {
                    [Op.gt]: 0,    // gia_km > 0
                    [Op.lt]: Sequelize.col('gia') // gia_km < gia (giá khuyến mãi phải nhỏ hơn giá gốc)
                }
            },
            order: [
                ['hot', 'DESC'],      // Ưu tiên hàng hot lên đầu
                ['luot_xem', 'DESC']  // Sau đó đến hàng nhiều lượt xem
            ],
            limit: soSp // Giới hạn số lượng sản phẩm trả về
        });

        if (sp_arr.length > 0) {
            res.json(sp_arr);
        } else {
            res.status(404).json({ message: "Không có sản phẩm sale nào!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// ============================================
// API TIN TỨC
// ============================================

// Lấy danh sách loại tin
app.get("/api/loaitin", async (req, res) => {
    try {
        const loaitin_arr = await LoaiTinModel.findAll({
            where: { an_hien: 1 },
            order: [['thu_tu', 'ASC']]
        });
        res.json(loaitin_arr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// ============================================
// API QUẢN LÝ TIN TỨC (ADMIN) - ĐẶT TRƯỚC :id
// ============================================

// Lấy danh sách tin tức có phân trang (Admin)
app.get('/api/tintuc/admin', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 15;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        const hot = req.query.hot !== undefined ? Number(req.query.hot) : undefined;

        // Build where clause
        const where = {};
        
        if (search) {
            where[Op.or] = [
                { tieu_de: { [Op.like]: `%${search}%` } },
                { mo_ta: { [Op.like]: `%${search}%` } }
            ];
        }
        
        if (categoryId) {
            where.id_loai = categoryId;
        }
        
        if (hot !== undefined) {
            where.hot = hot;
        }

        const { count, rows } = await TinTucModel.findAndCountAll({
            where: where,
            include: [{
                model: LoaiTinModel,
                as: 'loai_tin',
                required: false
            }],
            order: [['id', 'DESC']],
            limit: limit,
            offset: offset
        });

        res.json({
            news: rows,
            total: count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách tin tức:', error);
        res.status(500).json({ "thong_bao": "Lỗi lấy danh sách tin tức", "error": error.message });
    }
});

// Thêm tin tức mới (Admin)
app.post('/api/tintuc', uploadNews.single('hinh'), async (req, res) => {
    try {
        const { tieu_de, slug, mo_ta, ngay, noi_dung, id_loai, hot, an_hien, tags } = req.body;

        // Validation
        if (!tieu_de || !id_loai) {
            return res.status(400).json({ "thong_bao": "Vui lòng điền đầy đủ thông tin" });
        }

        // Lấy đường dẫn file upload
        const hinh = req.file ? `/uploads/news/${req.file.filename}` : '';

        // Tạo tin tức mới
        const newNews = await TinTucModel.create({
            tieu_de,
            slug: slug || tieu_de.toLowerCase().replace(/\s+/g, '-'),
            mo_ta: mo_ta || '',
            hinh,
            ngay: ngay || new Date().toISOString().split('T')[0],
            noi_dung: noi_dung || '',
            id_loai: Number(id_loai),
            hot: Number(hot) || 0,
            an_hien: Number(an_hien) || 1,
            luot_xem: 0,
            tags: tags || ''
        });

        res.json({
            "thong_bao": "Thêm tin tức thành công",
            "news": newNews
        });
    } catch (error) {
        console.error('Lỗi thêm tin tức:', error);
        res.status(500).json({ "thong_bao": "Lỗi thêm tin tức", "error": error.message });
    }
});

// Cập nhật tin tức (Admin)
app.put('/api/tintuc/:id', uploadNews.single('hinh'), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { tieu_de, slug, mo_ta, ngay, noi_dung, id_loai, hot, an_hien, tags } = req.body;

        const news = await TinTucModel.findByPk(id);
        if (!news) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy tin tức" });
        }

        // Nếu có file mới, xóa file cũ
        let hinh = news.hinh;
        if (req.file) {
            // Xóa file cũ nếu là local file
            if (news.hinh && news.hinh.startsWith('/uploads/')) {
                const oldFilePath = path.join(__dirname, '../public', news.hinh);
                deleteFile(oldFilePath);
            }
            hinh = `/uploads/news/${req.file.filename}`;
        }

        await news.update({
            tieu_de,
            slug: slug || tieu_de.toLowerCase().replace(/\s+/g, '-'),
            mo_ta: mo_ta || '',
            hinh,
            ngay: ngay || news.ngay,
            noi_dung: noi_dung || '',
            id_loai: Number(id_loai),
            hot: Number(hot) || 0,
            an_hien: Number(an_hien) || 1,
            tags: tags || ''
        });

        res.json({
            "thong_bao": "Cập nhật tin tức thành công",
            "news": news
        });
    } catch (error) {
        console.error('Lỗi cập nhật tin tức:', error);
        res.status(500).json({ "thong_bao": "Lỗi cập nhật tin tức", "error": error.message });
    }
});

// Xóa tin tức (Admin)
app.delete('/api/tintuc/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const news = await TinTucModel.findByPk(id);
        if (!news) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy tin tức" });
        }

        // Xóa file ảnh nếu là local file
        if (news.hinh && news.hinh.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../public', news.hinh);
            deleteFile(filePath);
        }

        await news.destroy();

        res.json({
            "thong_bao": "Xóa tin tức thành công"
        });
    } catch (error) {
        console.error('Lỗi xóa tin tức:', error);
        res.status(500).json({ "thong_bao": "Lỗi xóa tin tức", "error": error.message });
    }
});

// ============================================
// API TIN TỨC CÔNG KHAI
// ============================================

// Lấy danh sách tin tức (có phân trang)
app.get("/api/tintuc", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const id_loai = req.query.id_loai;

        const whereClause = { an_hien: 1 };
        if (id_loai) {
            whereClause.id_loai = id_loai;
        }

        const { count, rows } = await TinTucModel.findAndCountAll({
            where: whereClause,
            include: [{
                model: LoaiTinModel,
                as: 'loai_tin',
                required: false
            }],
            order: [['ngay', 'DESC'], ['id', 'DESC']],
            limit: limit,
            offset: offset
        });

        res.json({
            news: rows,
            total: count,
            page: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Lấy tin tức hot
app.get("/api/tintuchot/:sotin", async (req, res) => {
    try {
        const sotin = Number(req.params.sotin) || 6;
        const tin_arr = await TinTucModel.findAll({
            where: { an_hien: 1, hot: 1 },
            include: [{
                model: LoaiTinModel,
                as: 'loai_tin',
                required: false
            }],
            order: [['ngay', 'DESC'], ['luot_xem', 'DESC']],
            limit: sotin
        });
        res.json(tin_arr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Lấy chi tiết một tin tức
app.get("/api/tintuc/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const tin = await TinTucModel.findOne({
            where: { id: id, an_hien: 1 },
            include: [{
                model: LoaiTinModel,
                as: 'loai_tin',
                required: false
            }]
        });

        if (!tin) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        // Tăng lượt xem
        await tin.increment('luot_xem');

        res.json(tin);
    } catch (error) {
        console.error('Lỗi API /api/tintuc/:id:', error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// Lấy tin tức liên quan
app.get("/api/tintuc/:id/lienquan", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const limit = Number(req.query.limit) || 4;

        // Lấy tin hiện tại để biết id_loai
        const tinHienTai = await TinTucModel.findByPk(id);
        if (!tinHienTai) {
            return res.status(404).json({ message: "Không tìm thấy tin tức" });
        }

        // Lấy tin cùng loại, trừ tin hiện tại
        const tinLienQuan = await TinTucModel.findAll({
            where: {
                an_hien: 1,
                id_loai: tinHienTai.id_loai,
                id: { [Op.ne]: id }
            },
            include: [{
                model: LoaiTinModel,
                as: 'loai_tin',
                required: false
            }],
            order: [['ngay', 'DESC']],
            limit: limit
        });

        res.json(tinLienQuan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// ============================================
// API QUẢN LÝ NGƯỜI DÙNG (ADMIN)
// ============================================

// Lấy danh sách users có phân trang (Admin)
app.get('/api/users/admin', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 15;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const role = req.query.role !== undefined ? Number(req.query.role) : undefined;

        // Build where clause
        const where = {};

        if (search) {
            where[Op.or] = [
                { ho_ten: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        if (role !== undefined) {
            where.vai_tro = role;
        }

        const { count, rows } = await UserModel.findAndCountAll({
            where: where,
            order: [['id', 'DESC']],
            limit: limit,
            offset: offset,
            attributes: ['id', 'email', 'ho_ten', 'vai_tro', 'khoa']
        });

        res.json({
            users: rows,
            total: count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách users:', error);
        res.status(500).json({ "thong_bao": "Lỗi lấy danh sách người dùng", "error": error.message });
    }
});

// Thêm user mới (Admin)
app.post('/api/users', async (req, res) => {
    try {
        const { email, mat_khau, ho_ten, vai_tro } = req.body;

        // Validation
        if (!email || !mat_khau || !ho_ten) {
            return res.status(400).json({ "thong_bao": "Vui lòng điền đầy đủ thông tin" });
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await UserModel.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ "thong_bao": "Email đã được sử dụng" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(mat_khau, 10);

        // Tạo user mới
        const newUser = await UserModel.create({
            email: email,
            mat_khau: hashedPassword,
            ho_ten: ho_ten,
            vai_tro: vai_tro || 0
        });

        res.json({
            "thong_bao": "Thêm người dùng thành công",
            "user": {
                id: newUser.id,
                email: newUser.email,
                ho_ten: newUser.ho_ten,
                vai_tro: newUser.vai_tro
            }
        });
    } catch (error) {
        console.error('Lỗi thêm user:', error);
        res.status(500).json({ "thong_bao": "Lỗi thêm người dùng", "error": error.message });
    }
});

// Cập nhật user (Admin)
app.put('/api/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { ho_ten, vai_tro } = req.body;

        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy người dùng" });
        }

        await user.update({
            ho_ten: ho_ten,
            vai_tro: vai_tro
        });

        res.json({
            "thong_bao": "Cập nhật người dùng thành công",
            "user": {
                id: user.id,
                email: user.email,
                ho_ten: user.ho_ten,
                vai_tro: user.vai_tro
            }
        });
    } catch (error) {
        console.error('Lỗi cập nhật user:', error);
        res.status(500).json({ "thong_bao": "Lỗi cập nhật người dùng", "error": error.message });
    }
});

// Đổi mật khẩu user (Admin)
app.put('/api/users/:id/password', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { mat_khau } = req.body;

        if (!mat_khau) {
            return res.status(400).json({ "thong_bao": "Vui lòng nhập mật khẩu" });
        }

        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy người dùng" });
        }

        // Hash password mới
        const hashedPassword = await bcrypt.hash(mat_khau, 10);

        await user.update({
            mat_khau: hashedPassword
        });

        res.json({
            "thong_bao": "Đổi mật khẩu thành công"
        });
    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        res.status(500).json({ "thong_bao": "Lỗi đổi mật khẩu", "error": error.message });
    }
});

// Khóa/Mở khóa user (Admin)
app.put('/api/users/:id/lock', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { khoa } = req.body;

        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy người dùng" });
        }

        await user.update({ khoa: khoa });

        res.json({
            "thong_bao": khoa === 1 ? "Khóa người dùng thành công" : "Mở khóa người dùng thành công"
        });
    } catch (error) {
        console.error('Lỗi khóa/mở khóa user:', error);
        res.status(500).json({ "thong_bao": "Lỗi khóa/mở khóa người dùng", "error": error.message });
    }
});

// Xóa user (Admin) - KHÔNG DÙNG NỮA
app.delete('/api/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ "thong_bao": "Không tìm thấy người dùng" });
        }

        await user.destroy();

        res.json({
            "thong_bao": "Xóa người dùng thành công"
        });
    } catch (error) {
        console.error('Lỗi xóa user:', error);
        res.status(500).json({ "thong_bao": "Lỗi xóa người dùng", "error": error.message });
    }
});

// Chạy server
app.listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
}).on('error', function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
});