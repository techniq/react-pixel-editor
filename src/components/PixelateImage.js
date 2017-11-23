import React, { Component } from 'react';
import { fileAsImageData, imageDataAsRgbaArray } from '../utilities/image';

class PixelateImage extends Component {
  state = {
    imgWidth: 100,
    imgHeight: 100
  };

  handleFileChange = async (e) => {
    const { width, height, onChange } = this.props;

    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      // console.log(file);
      const imageData = await fileAsImageData(file, width, height);

      this.setState({
        imgWidth: width,
        imgHeight: height
      });

      const previewCtx = this.preview.getContext('2d');
      previewCtx.scale(imageData.width/width, imageData.height/height);
      previewCtx.imageSmoothingEnabled = false;
      previewCtx.webkitImageSmoothingEnabled = false;
      previewCtx.mozImageSmoothingEnabled = false;
      previewCtx.putImageData(imageData, 0, 0);

      const pixels = imageDataAsRgbaArray(imageData);
      onChange(pixels);
    }
  };
  
  render() {
    const { imgWidth, imgHeight } = this.state;
    
    return (
      <div>
        <input type="file" accept="image/*" onChange={this.handleFileChange} />
        <canvas
          width={imgWidth}
          height={imgHeight}
          ref={el => this.preview = el} />
      </div>
    )
  }
}

export default PixelateImage;