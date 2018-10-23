import React, { Component } from 'react';

class Splitter extends Component {
	render() {
		return (
			<div 
				className='divider'
				style={{height: this.props.height}}
				onMouseDown={this.props.handleMouseDown}
			>
			</div>
		);
  }
}

export default Splitter;