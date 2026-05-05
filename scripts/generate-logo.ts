import sharp from 'sharp';
import fs from 'fs';

async function generatePng() {
  try {
    const svgBuffer = fs.readFileSync('public/favicon.svg');
    await sharp(svgBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile('public/logo.png');
    console.log('Successfully created public/logo.png');
  } catch (err) {
    console.error('Error creating logo:', err);
  }
}

generatePng();
