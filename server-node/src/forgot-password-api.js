import { UserModel, OTPModel } from './database.js';
import { sendOTPEmail, generateOTP } from './email-config.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

// ============================================
// API QUÊN MẬT KHẨU
// ============================================

// Bước 1: Gửi OTP qua email
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate
        if (!email) {
            return res.status(400).json({ "thong_bao": "Vui lòng nhập email" });
        }

        // Kiểm tra email có tồn tại không
        const user = await UserModel.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ "thong_bao": "Email không tồn tại trong hệ thống" });
        }

        // Tạo mã OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Hết hạn sau 5 phút

        // Xóa các OTP cũ chưa sử dụng của email này
        await OTPModel.destroy({
            where: {
                email: email,
                used: false
            }
        });

        // Lưu OTP vào database
        await OTPModel.create({
            email: email,
            otp: otp,
            expires_at: expiresAt,
            used: false
        });

        // Gửi email
        const emailResult = await sendOTPEmail(email, otp, user.ho_ten);

        if (emailResult.success) {
            console.log('Đã gửi OTP:', otp, 'đến email:', email);
            res.json({
                "thong_bao": "Mã OTP đã được gửi đến email của bạn",
                "email": email
            });
        } else {
            res.status(500).json({ "thong_bao": "Không thể gửi email. Vui lòng thử lại sau" });
        }

    } catch (error) {
        console.error('Lỗi gửi OTP:', error);
        res.status(500).json({ "thong_bao": "Lỗi server", "error": error.message });
    }
};

// Bước 2: Xác thực OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate
        if (!email || !otp) {
            return res.status(400).json({ "thong_bao": "Vui lòng nhập đầy đủ thông tin" });
        }

        // Tìm OTP trong database
        const otpRecord = await OTPModel.findOne({
            where: {
                email: email,
                otp: otp,
                used: false,
                expires_at: {
                    [Op.gt]: new Date() // Chưa hết hạn
                }
            },
            order: [['created_at', 'DESC']]
        });

        if (!otpRecord) {
            return res.status(400).json({ "thong_bao": "Mã OTP không đúng hoặc đã hết hạn" });
        }

        // OTP hợp lệ
        res.json({
            "thong_bao": "Xác thực thành công",
            "email": email,
            "otp_id": otpRecord.id
        });

    } catch (error) {
        console.error('Lỗi xác thực OTP:', error);
        res.status(500).json({ "thong_bao": "Lỗi server", "error": error.message });
    }
};

// Bước 3: Đặt lại mật khẩu mới
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, mat_khau_moi } = req.body;

        // Validate
        if (!email || !otp || !mat_khau_moi) {
            return res.status(400).json({ "thong_bao": "Vui lòng nhập đầy đủ thông tin" });
        }

        if (mat_khau_moi.length < 6) {
            return res.status(400).json({ "thong_bao": "Mật khẩu phải có ít nhất 6 ký tự" });
        }

        // Kiểm tra OTP lần nữa
        const otpRecord = await OTPModel.findOne({
            where: {
                email: email,
                otp: otp,
                used: false,
                expires_at: {
                    [Op.gt]: new Date()
                }
            },
            order: [['created_at', 'DESC']]
        });

        if (!otpRecord) {
            return res.status(400).json({ "thong_bao": "Mã OTP không hợp lệ" });
        }

        // Tìm user
        const user = await UserModel.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ "thong_bao": "Người dùng không tồn tại" });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(mat_khau_moi, 10);

        // Cập nhật mật khẩu
        await user.update({ mat_khau: hashedPassword });

        // Đánh dấu OTP đã sử dụng
        await otpRecord.update({ used: true });

        console.log('Đã đặt lại mật khẩu cho:', email);

        res.json({
            "thong_bao": "Đặt lại mật khẩu thành công",
            "email": email
        });

    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error);
        res.status(500).json({ "thong_bao": "Lỗi server", "error": error.message });
    }
};
