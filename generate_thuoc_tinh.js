const fs = require('fs');

const cpuOptions = ['Intel Core i3-1215U', 'Intel Core i5-12450H', 'Intel Core i7-13700H', 'Intel Core i9-13980HX', 'AMD Ryzen 5 5500U', 'AMD Ryzen 7 7735HS', 'AMD Ryzen 9 7940HS', 'Intel Core Ultra 5 125H'];
const ramOptions = ['8GB DDR4', '16GB DDR4', '32GB DDR4', '64GB DDR4', '8GB DDR5', '16GB DDR5', '32GB DDR5'];
const gpuOptions = ['Intel UHD Graphics', 'NVIDIA RTX 3050 4GB', 'NVIDIA RTX 4050 6GB', 'NVIDIA RTX 4060 8GB', 'NVIDIA RTX 4070 8GB', 'NVIDIA RTX 4080 12GB', 'NVIDIA RTX 4090 16GB', 'AMD Radeon RX 6600M'];
const storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '512GB NVMe', '1TB NVMe', '2TB NVMe'];
const screenOptions = ['14 inch FHD IPS', '15.6 inch FHD IPS', '15.6 inch FHD 144Hz', '16 inch 2.5K OLED', '17.3 inch FHD 165Hz', '14 inch OLED'];
const batteryOptions = ['3-cell 42Wh', '4-cell 56Wh', '6-cell 72Wh', '8-cell 99Wh', 'Li-ion 52Wh'];
const weightOptions = ['1.2kg', '1.4kg', '1.6kg', '1.8kg', '2.0kg', '2.3kg', '2.5kg'];
const colorOptions = ['Đen', 'Trắng', 'Bạc', 'Xám', 'Xanh dương', 'Đỏ'];
const connectionOptions = ['Wi-Fi 6, Bluetooth 5.2', 'Wi-Fi 6E, Bluetooth 5.3', 'Wi-Fi 7, Bluetooth 5.4', 'Wi-Fi 6, Bluetooth 5.0'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let sql = '-- Sample data for thuoc_tinh (thuộc tính sản phẩm)\n';
sql += 'INSERT INTO thuoc_tinh (id, id_sp, cpu, ram, gpu, dia_cung, man_hinh, pin, cong_ket_noi, mau_sac, can_nang, created_at, updated_at) VALUES\n';

for (let i = 1; i <= 200; i++) {
  const cpu = getRandomItem(cpuOptions);
  const ram = getRandomItem(ramOptions);
  const gpu = getRandomItem(gpuOptions);
  const storage = getRandomItem(storageOptions);
  const screen = getRandomItem(screenOptions);
  const battery = getRandomItem(batteryOptions);
  const weight = getRandomItem(weightOptions);
  const color = getRandomItem(colorOptions);
  const connection = getRandomItem(connectionOptions);
  
  sql += `(${i}, ${i}, '${cpu}', '${ram}', '${gpu}', '${storage}', '${screen}', '${battery}', '${connection}', '${color}', '${weight}', NULL, NULL)`;
  
  if (i < 200) {
    sql += ',\n';
  } else {
    sql += ';\n';
  }
}

fs.writeFileSync('thuoc_tinh_data.sql', sql);
console.log('Generated thuoc_tinh for 200 products in thuoc_tinh_data.sql');
