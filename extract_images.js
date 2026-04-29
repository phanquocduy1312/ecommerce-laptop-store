const fs = require('fs');

// Read laptop.sql to extract image URLs
const content = fs.readFileSync('laptop.sql', 'utf8');

// Extract all image URLs from the file
const imageRegex = /https:\/\/cdn\.tgdd\.vn\/Products\/Images\/[^,')]+/g;
const images = content.match(imageRegex) || [];

console.log(`Found ${images.length} unique image URLs`);

// Deduplicate images
const uniqueImages = [...new Set(images)];
console.log(`After deduplication: ${uniqueImages.length} unique images`);

// Save unique images to file
fs.writeFileSync('image_urls.json', JSON.stringify(uniqueImages, null, 2));
console.log('Saved to image_urls.json');
