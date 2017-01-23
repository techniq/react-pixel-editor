import React, { Component } from 'react';

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
    throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

class PixelateImage extends Component {
  state = {
    imgWidth: 100,
    imgHeight: 100
  };

  handleFileChange = (e) => {
    const { width, height } = this.props;

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      this.setState({
        imgWidth: img.width,
        imgHeight: img.height
      });
      
      // Draw image to requested width and height
      // TODO: ability to maintain aspect ratio
      ctx.drawImage(img, 0, 0, width, height);

      // Cleanup to avoid leaing memory
      URL.revokeObjectURL(img.src);

      const previewCtx = this.preview.getContext('2d');
      previewCtx.scale(img.width/width, img.height/height);
      previewCtx.imageSmoothingEnabled = false;
      previewCtx.webkitImageSmoothingEnabled = false;
      previewCtx.mozImageSmoothingEnabled = false;
      previewCtx.drawImage(canvas, 0, 0);
      
      /* Read pixel data */
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      // => [r,g,b,a,...]

      const pixels = [];
      for (let i = 0; i < data.length; i += 4) {
        pixels.push('#' + rgbToHex(
          data[i],
          data[i+1],
          data[i+2]
          // data[i+3] == alpha
        ))
      }
      console.log(`pixels (${img.width}x${img.height})`, pixels);
    };
    img.src = URL.createObjectURL(e.target.files[0]);
  };
  
  render() {
    const { imgWidth, imgHeight } = this.state;
    
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <canvas
          width={imgWidth}
          height={imgHeight}
          ref={el => this.preview = el} />
      </div>
    )
  }
}

export default PixelateImage;