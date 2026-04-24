import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification';

interface ContactInfo {
  icon: string;
  title: string;
  content: string;
  link?: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-lien-he',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lien-he.html',
  styleUrl: './lien-he.css'
})
export class LienHe {
  contactForm: FormGroup;
  loading = signal(false);
  submitted = signal(false);

  contactInfo = signal<ContactInfo[]>([
    {
      icon: 'call',
      title: 'Hotline',
      content: '1900 1234',
      link: 'tel:19001234'
    },
    {
      icon: 'mail',
      title: 'Email',
      content: 'support@techcore.vn',
      link: 'mailto:support@techcore.vn'
    },
    {
      icon: 'location_on',
      title: 'Địa chỉ',
      content: '123 Nguyễn Huệ, Q.1, TP.HCM'
    },
    {
      icon: 'schedule',
      title: 'Giờ làm việc',
      content: '8:00 - 22:00 (Hàng ngày)'
    }
  ]);

  faqs = signal<FAQ[]>([
    {
      question: 'Làm thế nào để đặt hàng?',
      answer: 'Bạn có thể đặt hàng trực tuyến qua website, gọi hotline 1900 1234, hoặc đến trực tiếp cửa hàng. Chúng tôi hỗ trợ nhiều hình thức thanh toán: COD, chuyển khoản, thẻ tín dụng.',
      isOpen: false
    },
    {
      question: 'Chính sách bảo hành như thế nào?',
      answer: 'Tất cả sản phẩm đều được bảo hành chính hãng từ 12-36 tháng tùy theo từng dòng máy. Chúng tôi hỗ trợ bảo hành tận nơi và đổi máy mới trong 30 ngày đầu nếu có lỗi từ nhà sản xuất.',
      isOpen: false
    },
    {
      question: 'Có hỗ trợ trả góp không?',
      answer: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng và các công ty tài chính. Thủ tục đơn giản, duyệt nhanh chỉ trong 15 phút.',
      isOpen: false
    },
    {
      question: 'Thời gian giao hàng bao lâu?',
      answer: 'Đơn hàng nội thành được giao trong 2-4 giờ. Đơn hàng ngoại thành và tỉnh được giao trong 1-3 ngày làm việc. Miễn phí vận chuyển cho đơn hàng trên 5 triệu.',
      isOpen: false
    },
    {
      question: 'Có thể đổi trả sản phẩm không?',
      answer: 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày nếu sản phẩm còn nguyên seal, chưa kích hoạt bảo hành. Chúng tôi sẽ hoàn tiền 100% hoặc đổi sang sản phẩm khác theo yêu cầu.',
      isOpen: false
    }
  ]);

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.contactForm = this.fb.group({
      ho_ten: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      so_dien_thoai: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      chu_de: ['', Validators.required],
      noi_dung: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) return 'Trường này là bắt buộc';
    if (field?.hasError('email')) return 'Email không hợp lệ';
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Tối thiểu ${minLength} ký tự`;
    }
    if (field?.hasError('pattern')) return 'Số điện thoại không hợp lệ (10 chữ số)';
    return '';
  }

  toggleFAQ(index: number) {
    const faqs = this.faqs();
    faqs[index].isOpen = !faqs[index].isOpen;
    this.faqs.set([...faqs]);
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    // Giả lập gửi form (thực tế sẽ gọi API)
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
      this.notification.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong 24h.');
      this.contactForm.reset();
      
      // Reset submitted sau 5s
      setTimeout(() => {
        this.submitted.set(false);
      }, 5000);
    }, 1500);
  }
}
