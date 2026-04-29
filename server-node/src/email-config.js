import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Cấu hình email transporter
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'phanquocduy1312@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'mvmu zsov ouds chkk'
    }
});

// Hàm gửi OTP
export const sendOTPEmail = async (toEmail, otp, userName) => {
    const mailOptions = {
        from: '"Tech Store" phanquocduy1312@gmail.com',
        to: toEmail,
        subject: 'Mã xác thực đặt lại mật khẩu',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
                    .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Đặt lại mật khẩu</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${userName}</strong>,</p>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        
                        <div class="otp-box">
                            <p style="margin: 0; color: #666;">Mã xác thực của bạn là:</p>
                            <div class="otp-code">${otp}</div>
                            <p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">Mã có hiệu lực trong 5 phút</p>
                        </div>

                        <div class="warning">
                            <strong>⚠️ Lưu ý:</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                <li>Không chia sẻ mã này với bất kỳ ai</li>
                                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                            </ul>
                        </div>

                        <p>Trân trọng,<br><strong>Tech Store Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        <p>&copy; 2026 Tech Store. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Lỗi gửi email:', error);
        return { success: false, error: error.message };
    }
};

// Hàm tạo mã OTP ngẫu nhiên 6 số
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
