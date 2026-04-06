import fs from 'fs';

const images = [
  '/home/z/my-project/upload/pasted_image_1771506136904.png',
  '/home/z/my-project/upload/pasted_image_1771962856953.png'
];

for (const imgPath of images) {
  if (fs.existsSync(imgPath)) {
    const stats = fs.statSync(imgPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`${imgPath}: EXISTS, Size: ${sizeKB} KB`);
  } else {
    console.log(`${imgPath}: NOT FOUND`);
  }
}
