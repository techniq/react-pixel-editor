import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 1 0 auto;
  margin: 1px;
  background-color: ${props => props.color || '#eee'};
  border: 1px solid #ddd;
  user-select: none;
  // border-radius: 50%;
`;

const Spacer = styled.span`
  float: left;
  padding-top: 100%;
`;

class Pixel extends Component {
  shouldComponentUpdate(nextProps, nextState) { 
    return nextProps.color !== this.props.color;
  }

  render() {
    const { color, onMouseDown, onMouseUp, onMouseOver, children } = this.props;
    return (
      <Wrapper color={color} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseOver={onMouseOver}>
        <Spacer />
        <span>{children}</span>
      </Wrapper>
    )
  }
}

export default Pixel;