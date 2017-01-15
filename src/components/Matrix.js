import React, { Component } from 'react';
import styled from 'styled-components';
import Pixel from './Pixel';
import ColorPicker from './ColorPicker';

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

class Matrix extends Component {
  state = {
    pixels: {},
    isColoring: false,
    currentColor: 'black',
  };

  componentWillMount() {
    const { rows, columns } = this.props;

    const pixels = {};

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      pixels[rowIndex] = {};
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
    // this.setState({ isColoring: false })
  };

  handlePixelMouseDown = (row, column) => {
    // console.log('handlePixelMouseDown', row, column);
    this.setState({ isColoring: true })
    this.togglePixel(row, column);
  };

  handlePixelMouseUp = (row, column) => {
    // console.log('handlePixelMouseUp', row, column);
    this.setState({ isColoring: false })
  };

  handlePixelMouseOver = (row, column) => {
    // console.log('handlePixelMouseOver', row, column);
    const { isColoring } = this.state;

    if (isColoring) {
      this.togglePixel(row, column);
    }
  };

  handleColorChange = (color) => {
    // console.log('handleColorChange', color);
    this.setState({ currentColor: color && color.hex })
  };

  togglePixel(row, column) {
    this.setState(({ pixels, currentColor }, props) => ({
      pixels: {
        ...pixels,
        [row]: {
          ...pixels[row],
          [column]: {
            ...pixels[row][column],
            color: currentColor
          }
        } 
      }
    }))
  }
  
  render() {
    const { rows, columns } = this.props;
    const { pixels, currentColor } = this.state;

    return (
      <div onMouseLeave={this.handleMouseLeave} style={{ margin: 20 }}>
        { Object.keys(pixels).map((row) => (
          <Row key={row}>
            {Object.keys(pixels[row]).map((column) => (
              <Pixel
                {...pixels[row][column]}
                onMouseDown={() => this.handlePixelMouseDown(row, column)}
                onMouseUp={() => this.handlePixelMouseUp(row, column)}
                onMouseOver={() => this.handlePixelMouseOver(row, column)}
                key={`pixel-${row}-${column}`}>
              </Pixel>
            ))}
          </Row>
        ))}
        <ColorPicker
          color={currentColor}
          onChange={this.handleColorChange}
        />
        <button onClick={() => this.handleColorChange(null)}>
          clear
        </button>
      </div>
    )
  }
}

export default Matrix;