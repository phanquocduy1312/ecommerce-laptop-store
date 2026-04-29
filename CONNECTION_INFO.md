# TiDB Cloud Connection Info

**Host:** gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com
**Port:** 4000
**Username:** 3QYyvYyuzFtwb5t.root
**Password:** p2U91ppblJPwqGLZ
**Database:** laptop

## Connection String (MySQL format)
```
mysql://3QYyvYyuzFtwb5t.root:p2U91ppblJPwqGLZ@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/laptop
```

## Connection String (JDBC format)
```
jdbc:mysql://gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/laptop?user=3QYyvYyuzFtwb5t.root&password=p2U91ppblJPwqGLZ
```

## Cách import SQL vào TiDB Cloud

### Cách 1: Dùng TiDB Cloud SQL Editor
1. Login vào TiDB Cloud Console
2. Chọn database "laptop"
3. Mở SQL Editor
4. Copy nội dung file `database_simple.sql`
5. Paste và chạy

### Cách 2: Dùng MySQL Command Line
```bash
mysql -h gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com -P 4000 -u 3QYyvYyuzFtwb5t.root -p laptop < database_simple.sql
```

### Cách 3: Dùng Node.js script
Tạo file `import_to_tidb.js`:
```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
  port: 4000,
  user: '3QYyvYyuzFtwb5t.root',
  password: 'p2U91ppblJPwqGLZ',
  database: 'laptop'
});

// Read SQL file
const fs = require('fs');
const sql = fs.readFileSync('database_simple.sql', 'utf8');

// Execute
await connection.query(sql);
console.log('Import successful!');
await connection.end();
```

## Cách update DATABASE_URL trong Render

Trong `render.yaml`, update:
```yaml
envVars:
  - key: DATABASE_URL
    value: mysql://3QYyvYyuzFtwb5t.root:p2U91ppblJPwqGLZ@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/laptop
```

HOẶC dùng Render database nếu muốn database tự động tạo.
