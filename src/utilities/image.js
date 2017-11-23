import { rgbaStringToArray, rgbaStringToRgbString } from './color';

export function fileAsImageData(file, width, height) {
  return new Promise((resolve, reject) => {

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      
      // Draw image to requested width and height
      // TODO: ability to maintain aspect ratio
      // TODO: Extract resizing as a separate function.  See also: https://stackoverflow.com/questions/3448347/how-to-scale-an-imagedata-in-html-canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Cleanup to avoid leaking memory
      URL.revokeObjectURL(img.src);

      const imageData = ctx.getImageData(0, 0, width, height);
      // TODO: pass img.width and img.height to know the original file's dimensions
      resolve(imageData);
    };

    // Start image loading
    img.src = URL.createObjectURL(file);
  })
}

export function imageDataAsRgbaArray(imageData) {
  const data = imageData.data; // => [r,g,b,a,...]

  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(`rgba(${data[i]}, ${data[i+1]}, ${data[i+2]}, ${data[i+3]/255})`)
  }
  return pixels
}

export function rgbaArrayAsImageData(rgbaArray, width, height) {
  var pixelData = [].concat(...rgbaArray.map(rgbaStringToArray));
  const imageData = new ImageData(new Uint8ClampedArray(pixelData), width, height);
  return imageData;
}

export function rgbaArrayAsRgbArray(rgbaArray, alphaAdjust = 1) {
  var pixelData = [].concat(...rgbaArray.map(rgb => rgbaStringToRgbString(rgb, alphaAdjust)));
  return pixelData;
}