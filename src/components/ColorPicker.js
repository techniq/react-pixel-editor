import React, { Component } from 'react'
import styled from 'styled-components'
import { SketchPicker } from 'react-color'

const Wrapper = styled.div`
  display: inline-block;
`;

const Swatch = styled.div`
  display: inline-block;
  padding: 5px;
  background: #fff;
  borderRadius: 1px;
  boxShadow: 0 0 0 1px rgba(0,0,0,.1);
  cursor: pointer;
`;

const Color = styled.div`
  width: 36px;
  height: 14px;
  borderRadius: 2px;
  background: ${props => props.value};
`;

const Popover = styled.div`
  position: absolute;
  zIndex: 2;
`;

const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

class ColorPicker extends Component {
  state = {
    displayColorPicker: false,
  };

  handleClick = () => {
    this.setState(({ displayColorPicker }) => ({ displayColorPicker: !displayColorPicker }));
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.hex })
    if (this.props.onChange) {
      this.props.onChange(color);
    }
  };

  render() {
    const { color } = this.props;
    const { displayColorPicker } = this.state;

    return (
      <Wrapper>
        <Swatch onClick={this.handleClick}>
          <Color value={color} />
        </Swatch>
        { displayColorPicker && (
          <Popover>
            <Cover onClick={this.handleClose}/>
            <SketchPicker color={color || 'black'} onChange={this.handleChange } />
          </Popover>
        )}
      </Wrapper>
    )
  }
}

export default ColorPicker