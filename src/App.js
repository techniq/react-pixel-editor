import React, { Component } from 'react';
import Matrix from './components/Matrix';
import PixelateImage from './components/PixelateImage';

class App extends Component {
  render() {
    return (
      <div>
        <Matrix rows={16} columns={16} />
        <PixelateImage width={16} height={16} />
      </div>
    );
  }
}

export default App;
