import { Sequelize, DataTypes } from 'sequelize';

// Cấu hình database (hardcoded cho dự án sinh viên)
// Render sẽ tự động cung cấp DATABASE_URL
let sequelize;

if (process.env.DATABASE_URL) {
  // Dùng DATABASE_URL từ Render
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Local development
  sequelize = new Sequelize(
    'laptop_node',
    'root',
    '',
    {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

export { sequelize };

export const LoaiModel = sequelize.define('loai',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ten_loai: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hinh_icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thu_tu: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    an_hien: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  },
  {
    timestamps: true,
    tableName: "loai",
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export const SanPhamModel = sequelize.define('san_pham',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ten_sp: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING },
    gia: { type: DataTypes.INTEGER, defaultValue: 0 },
    gia_km: { type: DataTypes.INTEGER, defaultValue: 0 },
    id_loai: { type: DataTypes.INTEGER, allowNull: false },
    ngay: { type: DataTypes.DATEONLY },
    hinh: { type: DataTypes.STRING },
    hot: { type: DataTypes.INTEGER, defaultValue: 0 },
    luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 1 },
    tinh_chat: { type: DataTypes.INTEGER, defaultValue: 0 },
    mo_ta: { type: DataTypes.TEXT, allowNull: true }
  },
  {
    tableName: "san_pham",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
  }
);

export const DonHangModel = sequelize.define('don_hang', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  thoi_diem_mua: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ngay: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('thoi_diem_mua');
    }
  },
  ho_ten: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  dien_thoai: { type: DataTypes.STRING, defaultValue: "" },
  dia_chi: { type: DataTypes.STRING, defaultValue: "" },
  ghi_chu: { type: DataTypes.STRING, defaultValue: "" },
  tong_tien: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  trang_thai: { type: DataTypes.TINYINT, defaultValue: 0 } // 0: Chờ xử lý, 1: Đã xác nhận, 2: Đang giao, 3: Hoàn thành, 4: Hủy
},
  { timestamps: false, tableName: "don_hang" }
);

export const DonHangChiTietModel = sequelize.define('don_hang_chi_tiet', {
  id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_dh: { type: DataTypes.INTEGER },
  id_sp: { type: DataTypes.INTEGER },
  so_luong: { type: DataTypes.INTEGER },
  gia: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
},
  { timestamps: false, tableName: "don_hang_chi_tiet" }
);

export const UserModel = sequelize.define('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, require: true },
  mat_khau: { type: DataTypes.STRING, require: true },
  ho_ten: { type: DataTypes.STRING, require: true },
  vai_tro: { type: DataTypes.TINYINT, defaultValue: 0 },
  khoa: { type: DataTypes.TINYINT, defaultValue: 0 }
}, { timestamps: false, tableName: "users" }
);

// ============================================
// MODEL OTP (Quên mật khẩu)
// ============================================
export const OTPModel = sequelize.define('password_reset_otp', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING(6), allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  used: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  timestamps: true,
  tableName: "password_reset_otp",
  createdAt: 'created_at',
  updatedAt: false
});

// ============================================
// MODEL THUỘC TÍNH (SPECS)
// ============================================
export const ThuocTinhModel = sequelize.define('thuoc_tinh',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_sp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cpu: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ram: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gpu: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dia_cung: {
      type: DataTypes.STRING,
      allowNull: true
    },
    man_hinh: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cong_ket_noi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mau_sac: {
      type: DataTypes.STRING,
      allowNull: true
    },
    can_nang: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: "thuoc_tinh",
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);


// ============================================
// RELATIONSHIPS (QUAN HỆ)
// ============================================

// 1 sản phẩm có NHIỀU thuộc tính
SanPhamModel.hasMany(ThuocTinhModel, {
  foreignKey: 'id_sp',
  as: 'thuoc_tinh'
});

// 1 thuộc tính thuộc về 1 sản phẩm
ThuocTinhModel.belongsTo(SanPhamModel, {
  foreignKey: 'id_sp',
  as: 'san_pham'
}); 

// ============================================
// MODEL LOẠI TIN
// ============================================
export const LoaiTinModel = sequelize.define('loai_tin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ten_loai: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100) },
  thu_tu: { type: DataTypes.TINYINT, defaultValue: 0 },
  an_hien: { type: DataTypes.TINYINT, defaultValue: 1 }
}, { timestamps: false, tableName: "loai_tin" });

// ============================================
// MODEL TIN TỨC
// ============================================
export const TinTucModel = sequelize.define('tin_tuc', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tieu_de: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false },
  mo_ta: { type: DataTypes.STRING(1000) },
  hinh: { type: DataTypes.STRING(255) },
  ngay: { type: DataTypes.DATEONLY },
  noi_dung: { type: DataTypes.TEXT },
  id_loai: { type: DataTypes.INTEGER, defaultValue: 0 },
  luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
  hot: { type: DataTypes.TINYINT, defaultValue: 0 },
  an_hien: { type: DataTypes.TINYINT, defaultValue: 1 },
  tags: { type: DataTypes.STRING(2000) }
}, { timestamps: false, tableName: "tin_tuc" });

// ============================================
// RELATIONSHIPS TIN TỨC
// ============================================

// 1 loại tin có NHIỀU tin tức
LoaiTinModel.hasMany(TinTucModel, {
  foreignKey: 'id_loai',
  as: 'tin_tuc'
});

// 1 tin tức thuộc về 1 loại tin
TinTucModel.belongsTo(LoaiTinModel, {
  foreignKey: 'id_loai',
  as: 'loai_tin'
});

// ============================================
// RELATIONSHIPS ĐỚN HÀNG
// ============================================

// 1 đơn hàng có NHIỀU chi tiết đơn hàng
DonHangModel.hasMany(DonHangChiTietModel, {
  foreignKey: 'id_dh',
  as: 'chi_tiet'
});

// 1 chi tiết đơn hàng thuộc về 1 đơn hàng
DonHangChiTietModel.belongsTo(DonHangModel, {
  foreignKey: 'id_dh',
  as: 'don_hang'
});

// 1 chi tiết đơn hàng thuộc về 1 sản phẩm
DonHangChiTietModel.belongsTo(SanPhamModel, {
  foreignKey: 'id_sp',
  as: 'san_pham'
});

// 1 sản phẩm có NHIỀU chi tiết đơn hàng
SanPhamModel.hasMany(DonHangChiTietModel, {
  foreignKey: 'id_sp',
  as: 'don_hang_chi_tiet'
});
 

// ============================================
// AUTO SYNC DATABASE (Tạo bảng tự động)
// ============================================

// Hàm đồng bộ database - tạo bảng nếu chưa có
export const syncDatabase = async () => {
    try {
        // Chỉ sync bảng OTP (không alter các bảng khác)
        await OTPModel.sync({ alter: false });
        console.log('✅ Database synced successfully');
    } catch (error) {
        console.error('❌ Error syncing database:', error);
    }
};
