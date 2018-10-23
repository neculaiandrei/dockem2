import React, { Component } from 'react';
import Window from './Window';
import Splitter from './Splitter';
import '../extensions/array';
import { getWindowsSizes } from '../utils/container';

const SPLITTER_HEIGHT = 4;
const SPACE_BETWEEN = 40;

class Container extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			resizing: false,
			activeSplitter: 1,
			splitters: [200, 400, 600, 710]
		};
		
		this.containerRef = React.createRef();
		
		this.resize = this.resize.bind(this);
		this.startResize = this.startResize.bind(this);
		this.stopResize = this.stopResize.bind(this);
	}

	componentDidMount() {
		const height = this.containerRef.current.offsetHeight;
		
		this.setState({
			height,
		});
	}

	resize(event) {
		const { height, resizing, splitters, activeSplitter } = this.state;

		if (!resizing) {
			return;
		}

		let newSplitter = event.clientY;
		const previousSplitter = activeSplitter ? splitters[activeSplitter - 1] : 0;
		const nextSplitter = activeSplitter === splitters.length - 1 ? height : splitters[activeSplitter + 1];
		
		if (newSplitter - SPACE_BETWEEN < previousSplitter) {
			newSplitter = previousSplitter + SPACE_BETWEEN;
		}

		if (newSplitter + SPACE_BETWEEN > nextSplitter) {
			newSplitter = nextSplitter - SPACE_BETWEEN;
		}

		const newSplitters = [...splitters];
		newSplitters[activeSplitter] = newSplitter;
		
		this.setState({
			splitters: newSplitters
		});
	}

	startResize(i) {
		this.setState({
			resizing: true,
			activeSplitter: i
		});
	}

	stopResize() {
		this.setState({
			resizing: false
		});
	}

	render() {
		const windowsSizes = getWindowsSizes(this.state.height, this.state.splitters);

		const content = 
			windowsSizes
				.map((s, i) => [
					<Window
						key={`w_${i}`} 
						height={s} 
					/>,
					<Splitter
						key={`S_${i}`}
						height={SPLITTER_HEIGHT}
						handleMouseDown={() => this.startResize(i)}
					/>
				])
				.flatten();

		return (
			<div 
				ref={this.containerRef}
				className='container container--vertical'
				onMouseMove={this.resize}
				onMouseUp={this.stopResize}
			>
				{content}
			</div>
		);
  }
}

export default Container;