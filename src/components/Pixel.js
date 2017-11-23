import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  flex: 1 0 auto;
  margin: 1px;
  // background-color: ${props => props.color || '#eee'};
  background-color: ${props => props.color || 'rgba(0,0,0,0)'};
  // border: 1px solid #ddd;
  // border: 1px solid ${props => props.color || '#ddd'};
  // border-radius: 50%;
  cursor: pointer;
  user-select: none;

  :hover {
    ${props => !props.color && css`background-color: ${props.currentColor};`}
    opacity: ${props => props.color ? .7 : .3}
  }
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
    const { color, currentColor, onMouseDown, onMouseUp, onMouseOver, children } = this.props;
    return (
      <Wrapper color={color} currentColor={currentColor} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseOver={onMouseOver}>
        <Spacer />
        <span>{children}</span>
      </Wrapper>
    )
  }
}

export default Pixel;