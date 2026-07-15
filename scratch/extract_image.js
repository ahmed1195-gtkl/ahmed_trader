import fs from 'fs';
import path from 'path';

const svgPath = 'src/assets/shukritrade_logo.svg';
const outputPath = 'src/assets/shukritrade_emblem.png';

try {
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const match = svgContent.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
  
  if (match && match[1]) {
    const base64Data = match[1];
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully extracted embedded PNG! Size: ${(buffer.length / 1024).toFixed(2)} KB`);
  } else {
    console.log('No embedded PNG found in the SVG.');
  }
} catch (err) {
  console.error('Error:', err);
}
