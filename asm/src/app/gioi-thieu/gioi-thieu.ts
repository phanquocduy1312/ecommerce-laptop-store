import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Statistic {
  icon: string;
  value: string;
  label: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  position: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-gioi-thieu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gioi-thieu.html',
  styleUrl: './gioi-thieu.css'
})
export class GioiThieu {
  statistics = signal<Statistic[]>([
    { icon: 'inventory_2', value: '10,000+', label: 'Sản phẩm chính hãng' },
    { icon: 'groups', value: '50,000+', label: 'Khách hàng tin tưởng' },
    { icon: 'store', value: '15+', label: 'Chi nhánh toàn quốc' },
    { icon: 'workspace_premium', value: '5+', label: 'Năm kinh nghiệm' }
  ]);

  features = signal<Feature[]>([
    {
      icon: 'verified',
      title: 'Sản phẩm chính hãng 100%',
      description: 'Cam kết cung cấp sản phẩm chính hãng từ các thương hiệu uy tín hàng đầu thế giới'
    },
    {
      icon: 'local_shipping',
      title: 'Giao hàng toàn quốc',
      description: 'Miễn phí vận chuyển cho đơn hàng trên 5 triệu, giao hàng nhanh chóng trong 24h'
    },
    {
      icon: 'support_agent',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi'
    },
    {
      icon: 'shield_with_heart',
      title: 'Bảo hành uy tín',
      description: 'Chính sách bảo hành rõ ràng, đổi trả trong 30 ngày nếu có lỗi từ nhà sản xuất'
    },
    {
      icon: 'payments',
      title: 'Thanh toán linh hoạt',
      description: 'Hỗ trợ đa dạng hình thức thanh toán: COD, chuyển khoản, trả góp 0%'
    },
    {
      icon: 'price_check',
      title: 'Giá cả cạnh tranh',
      description: 'Cam kết giá tốt nhất thị trường, hoàn tiền nếu tìm thấy giá rẻ hơn'
    }
  ]);

  values = signal([
    {
      icon: 'favorite',
      title: 'Khách hàng là trung tâm',
      description: 'Chúng tôi luôn đặt lợi ích và trải nghiệm của khách hàng lên hàng đầu'
    },
    {
      icon: 'handshake',
      title: 'Uy tín & Chất lượng',
      description: 'Xây dựng niềm tin thông qua sản phẩm chất lượng và dịch vụ tận tâm'
    },
    {
      icon: 'trending_up',
      title: 'Đổi mới không ngừng',
      description: 'Không ngừng cải tiến để mang đến trải nghiệm mua sắm tốt nhất'
    },
    {
      icon: 'diversity_3',
      title: 'Trách nhiệm xã hội',
      description: 'Đóng góp tích cực cho cộng đồng và phát triển bền vững'
    }
  ]);

  milestones = signal([
    { year: '2019', title: 'Thành lập', description: 'TechCore được thành lập với sứ mệnh mang công nghệ đến gần hơn với mọi người' },
    { year: '2020', title: 'Mở rộng', description: 'Khai trương 5 chi nhánh đầu tiên tại Hà Nội và TP.HCM' },
    { year: '2021', title: 'Phát triển', description: 'Ra mắt nền tảng thương mại điện tử và dịch vụ giao hàng toàn quốc' },
    { year: '2022', title: 'Đối tác chiến lược', description: 'Trở thành đối tác chính thức của Dell, HP, Lenovo tại Việt Nam' },
    { year: '2023', title: 'Mở rộng quy mô', description: 'Đạt mốc 15 chi nhánh và 50,000+ khách hàng tin tưởng' },
    { year: '2024', title: 'Tương lai', description: 'Tiếp tục đổi mới và phát triển để phục vụ khách hàng tốt hơn' }
  ]);
}
