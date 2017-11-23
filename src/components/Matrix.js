import React, { Component } from 'react';
import styled from 'styled-components';
import Pixel from './Pixel';

const color = '#ddd';
const size = '50px';
const halfSize = '25px';

const Wrapper = styled.div`
  margin: 20px;
  height: 90vmin;
  width: 90vmin;

  background-image:
    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%), 
    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%);

  background-size: ${size} ${size};
  
  background-position:
    0 0,
    ${halfSize} ${halfSize}
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

class Matrix extends Component {

  render() {
    const {
      pixels,
      onMouseLeave,
      onPixelMouseDown,
      onPixelMouseUp,
      onPixelMouseOver,
      currentColor,
    } = this.props;

    return (
      <Wrapper onMouseLeave={onMouseLeave}>
        { pixels.map((row, rowIndex) => (
          <Row key={`row-${rowIndex}`}>
            {row.map((pixel, columnIndex) => (
              <Pixel
                {...pixel}
                onMouseDown={() => onPixelMouseDown(rowIndex, columnIndex)}
                onMouseUp={() => onPixelMouseUp(rowIndex, columnIndex)}
                onMouseOver={() => onPixelMouseOver(rowIndex, columnIndex)}
                currentColor={currentColor}
                key={`pixel-${rowIndex}-${columnIndex}`}>
              </Pixel>
            ))}
          </Row>
        ))}
      </Wrapper>
    )
  }
}

export default Matrix;