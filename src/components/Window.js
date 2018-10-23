import React, { Component } from 'react';

class Window extends Component {
	render() {
		return (
      <div
        className='window'
        style={{
          height: this.props.height || 'auto',
          width: this.props.width || 'auto'
        }}
      >
        Window
      </div>
		);
  }
}

export default Window;