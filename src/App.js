import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import Matrix from './components/Matrix';
import ColorPicker from './components/ColorPicker';
import PixelateImage from './components/PixelateImage';
import {
  fileAsImageData,
  imageDataAsRgbaArray,
  rgbaArrayAsImageData,
  rgbaArrayAsRgbArray
} from './utilities/image';

function sendToServer(pixels, alphaAdjust = 1) {
  console.log(alphaAdjust);
  const pixelData = [].concat(...pixels.map((row, rowIndex) => {
    const rowData = row.map(p => p.color)
    return (rowIndex % 2) ? rowData : rowData.reverse();
  })); // flatten into single array of rgba strings
  const colorData = rgbaArrayAsRgbArray(pixelData, alphaAdjust);

  fetch('http://localhost:5000/lights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(colorData)
  })
}

class App extends Component {
  state = {
    rows: 16,
    columns: 16,
    pixels: [],
    isColoring: false,
    currentColor: 'rgba(0,0,0,1)',
    brightness: .5
  };

  componentWillMount() {
    const { rows, columns } = this.state;
    const pixels = [];

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      pixels[rowIndex] = [];
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        pixels[rowIndex][columnIndex] = {
          color: null
        };
      }
    }

    this.setState({ pixels });
  }

  handleMouseLeave = (e) => {
    // console.log('handleMouseLeave', e);
    // TODO: Consider whether this is desired or not
    //   - Without this, dragging outside of Matrix (or Browser) and releasing the mouse will mean coloring will still occur when the mouse re-enters the Matrix
    //   - With this, it can be easy to drag outside the Matrix while coloring the edges
    //   - Maybe start a timer and if not re-entered, then cancel the coloring?
    //   - If clicked outside on <Matrix />, this should definately cancel the operation
    // this.setState({ isColoring: false })
  };

  setPixels = (pixelsArray) => {
    const { rows, columns, brightness } = this.state;
    const pixels = [];

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      pixels[rowIndex] = [];
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        pixels[rowIndex][columnIndex] = {
          color: pixelsArray[(rowIndex * rows) + columnIndex]
        };
      }
    }

    sendToServer(pixels, brightness);

    this.setState({ pixels });
  }

  handlePixelMouseDown = (row, column) => {
    this.setState({ isColoring: true })
    this.togglePixel(row, column);
  };

  handlePixelMouseUp = (row, column) => {
    this.setState({ isColoring: false })
  };

  handlePixelMouseOver = (row, column) => {
    if (this.state.isColoring) {
      this.togglePixel(row, column);
    }
  };

  handleColorChange = (color) => {
    if (color) {
      const { r, g, b, a } = color.rgb;
      this.setState({ currentColor: `rgba(${r}, ${g}, ${b}, ${a})` })
    } else {
      this.setState({ currentColor: null })
    }
  };

  togglePixel(row, column) {
    this.setState(({ pixels, currentColor, brightness }, props) => {
      const newPixels = [...pixels];
      newPixels[row] = [...pixels[row]];
      newPixels[row][column] = {
        ...pixels[row][column],
        color: currentColor
      }

      // TODO: Send individual pixel to server?
      sendToServer(newPixels, brightness);

      // console.log('togglePixel', row, column, newPixels);
      return { pixels: newPixels };
    })
  }

  handleImport = async (files) => {
    const { rows, columns } = this.state;
    if (files.length) {
      const imageData = await fileAsImageData(files[0], rows, columns);
      const pixels = imageDataAsRgbaArray(imageData);
      this.setPixels(pixels);
    }
  }

  handleExport = (e) => {
    const { pixels, rows, columns } = this.state;

    const canvas = document.createElement('canvas');
    canvas.height = rows;
    canvas.width = columns;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;

    const pixelData = [].concat(...pixels.map(row => row.map(p => p.color))); // flatten into single array of rgba strings
    const imageData = rgbaArrayAsImageData(pixelData, columns, rows);
    ctx.putImageData(imageData, 0, 0);
    this.setState({ data: canvas.toDataURL('image/png') })
  }

  // handleRangeChange = e => {
  //   sendToServer([
  //     [
  //       ...this.state.pixels[0].slice(0, e.target.value),
  //      ...[...Array(12 - e.target.value).keys()].map(i => `rgba(0,0,0,0)`) 
  //     ]
  //   ])
  // }
  
  handleBrightnessChange = e => {
    this.setState({ brightness: e.target.value })
    sendToServer(this.state.pixels, e.target.value);
  }

  render() {
    const {
      rows,
      columns,
      pixels,
      currentColor,
      data,
      brightness
    } = this.state;

    return (
      <div>
        <Dropzone accept="image/*" onDropAccepted={this.handleImport} disableClick={true} style={{}}>
          <Matrix
            pixels={pixels}
            onMouseLeave={this.handleMouseLeave}
            onPixelMouseDown={this.handlePixelMouseDown}
            onPixelMouseUp={this.handlePixelMouseUp}
            onPixelMouseOver={this.handlePixelMouseOver}
            currentColor={currentColor}
          />
        </Dropzone>
        <ColorPicker
          color={currentColor}
          onChange={this.handleColorChange}
        />
        <button onClick={() => this.handleColorChange(null)}>clear</button>
        <a href={data} download="export.png" onClick={this.handleExport}><button>Export</button></a>
        <input type="range" min="0" max="1" step=".1" onChange={this.handleBrightnessChange} value={brightness} />
        <PixelateImage
          width={rows}
          height={columns}
          onChange={this.setPixels}
        />
      </div>
    );
  }
}

export default App;
