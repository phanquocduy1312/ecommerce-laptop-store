const fs = require('fs');

const categories = [
  { id: 1, name: 'Asus' },
  { id: 2, name: 'Acer' },
  { id: 3, name: 'Lenovo' },
  { id: 4, name: 'MSI' },
  { id: 5, name: 'HP' },
  { id: 6, name: 'Dell' },
  { id: 7, name: 'Apple' },
  { id: 8, name: 'Surface' },
  { id: 9, name: 'Masstel' },
  { id: 10, name: 'LG' }
];

// Load real image URLs from laptop.sql
const imageUrls = JSON.parse(fs.readFileSync('image_urls.json', 'utf8'));

const cpuOptions = ['i3 1215U', 'i5 12450H', 'i7 13700H', 'i9 13980HX', 'Ryzen 5 5500U', 'Ryzen 7 7735HS', 'Ryzen 9 7940HS', 'Ultra 5 125H'];
const ramOptions = ['8GB', '16GB', '32GB', '64GB'];
const gpuOptions = ['Intel UHD', 'RTX 3050', 'RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'AMD Radeon'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomImage() {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

function generatePrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDate(startYear, endYear) {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let sql = '-- Sample data for san_pham (products) - 200 products with real images\n';
sql += 'INSERT INTO san_pham (id, ten_sp, slug, gia, gia_km, id_loai, ngay, hinh, hot, luot_xem, an_hien, tinh_chat, mo_ta, created_at, updated_at, deleted_at) VALUES\n';

for (let i = 1; i <= 200; i++) {
  const category = getRandomItem(categories);
  const cpu = getRandomItem(cpuOptions);
  const ram = getRandomItem(ramOptions);
  const gpu = getRandomItem(gpuOptions);
  const price = generatePrice(5000000, 35000000);
  const discountPrice = Math.floor(price * 0.85);
  
  const productName = `${category.name} Laptop ${cpu} ${ram} ${gpu}`;
  const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const date = generateDate(2022, 2024);
  const hot = Math.random() > 0.7 ? 1 : 0;
  const views = generatePrice(50, 1000);
  const tinhChat = Math.random() > 0.5 ? 1 : 0;
  const image = getRandomImage();
  
  sql += `(${i}, '${productName}', '${slug}', ${price}, ${discountPrice}, ${category.id}, '${date}', '${image}', ${hot}, ${views}, 1, ${tinhChat}, NULL, NULL, NULL, NULL)`;
  
  if (i < 200) {
    sql += ',\n';
  } else {
    sql += ';\n';
  }
}

fs.writeFileSync('products_200_real.sql', sql);
console.log('Generated 200 products with real images in products_200_real.sql');
