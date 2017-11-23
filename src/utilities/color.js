// See: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
// See also: http://bgrins.github.io/TinyColor/ or https://github.com/Qix-/color
export function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw new Error('Invalid color component');
  }
  const rgb = ((r << 16) | (g << 8) | b);
  // Left pad `0`s (for black)
  return ((1 << 24) + rgb).toString(16).slice(1)
}

export function hexToRgb(hex) {
  var bigint = parseInt(hex.startsWith('#') ? hex.slice(1) : hex, 16);
  console.log('hex', hex, 'bigint', bigint);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}

/**
 * Convert `rgba(255,255,255,.5)` to `[255,255,255,128]`
 * @param {string} rgbaString 
 */
export function rgbaStringToArray(rgbaString) {
  if (rgbaString) {
    const arr = rgbaString.match(/(0?\.?\d{1,3})%?\b/g).map(Number);
    arr[3] = Math.round(arr[3] * 255)
    return arr;
  } else {
    // Transparent pixel
    return [0,0,0,0];
  }
}

/**
 * Convert `rgba(255,255,255.5)` to `rgb(128,128,128)`
 * @param {*} rgbaString 
 */
export function rgbaStringToRgbString(rgbaString, alphaAdjust = 1) {
  if (rgbaString) {
    const [r,g,b,a] = rgbaString.match(/(0?\.?\d{1,3})%?\b/g).map(Number);
    // Alpha reduces individual color channels
    const red = Math.round(r * a * alphaAdjust);
    const green = Math.round(g * a * alphaAdjust);
    const blue = Math.round(b * a * alphaAdjust);
    return `rgb(${red},${green},${blue})`;
  } else {
    return 'rgb(0,0,0)';
  }
}