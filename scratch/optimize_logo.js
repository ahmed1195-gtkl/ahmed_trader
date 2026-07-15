import fs from 'fs';

async function run() {
  const inputPng = 'src/assets/shukritrade_emblem.png';
  const svgPath = 'src/assets/shukritrade_logo.svg';

  if (!fs.existsSync(inputPng)) {
    console.error(`Error: ${inputPng} not found. Run extract_image.js first.`);
    return;
  }

  const { Jimp } = await import('jimp');

  console.log('Reading emblem PNG...');
  const image = await Jimp.read(inputPng);

  console.log(`Original dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
  
  // Jimp v1 resize signature: resize({ w, h })
  image.resize({ w: 256, h: 256 });
  console.log(`Resized to: ${image.bitmap.width}x${image.bitmap.height}`);

  const buffer = await image.getBuffer('image/png');
  const base64Data = buffer.toString('base64');
  console.log(`Optimized PNG base64 size: ${(base64Data.length / 1024).toFixed(2)} KB`);

  // Replace base64 in SVG
  let svgContent = fs.readFileSync(svgPath, 'utf8');
  const oldSize = svgContent.length;

  const updatedSvg = svgContent.replace(
    /xlink:href="data:image\/png;base64,[^"]+"/,
    `xlink:href="data:image/png;base64,${base64Data}"`
  );

  fs.writeFileSync(svgPath, updatedSvg);

  const newSize = updatedSvg.length;
  console.log(`\nSVG size: ${(oldSize / 1024 / 1024).toFixed(2)} MB → ${(newSize / 1024).toFixed(2)} KB`);
  console.log(`Reduction: ${((1 - newSize / oldSize) * 100).toFixed(1)}%`);
  console.log('SVG optimized successfully!');
}

run().catch(console.error);
