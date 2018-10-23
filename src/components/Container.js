import React, { Component } from 'react';
import classNames from 'classnames';
import Window from './Window';
import Splitter from './Splitter';
import '../extensions/array';
import { getWindowsSizes, ensureEnoughSpaceBetweenSplitters } from '../utils/container';

const SPLITTER_SIZE = 5;
const SPACE_BETWEEN = 40;

class Container extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			width: 0,
			direction: 0,
			resizing: false,
			activeSplitter: 1,
			splitters: [200, 420, 640, 760]
		};
		
		this.containerRef = React.createRef();
		
		this.resize = this.resize.bind(this);
		this.startResize = this.startResize.bind(this);
		this.stopResize = this.stopResize.bind(this);
		this.changeDirection = this.changeDirection.bind(this);
	}

	componentDidMount() {
		const height = this.containerRef.current.offsetHeight;
		const width = this.containerRef.current.offsetWidth;
		
		this.setState({
			height,
			width
		});
	}

	changeDirection(event) {
		if (event.key === 'h') {
			this.setState({
				direction: 0
			});
		} else if (event.key === 'v') {
			this.setState({
				direction: 1
			});
		}
	}

	resize(event) {
		const { height, width, direction, resizing, splitters, activeSplitter } = this.state;

		if (!resizing) {
			return;
		}

		let mousePosition = direction ? event.clientY : event.clientX;
		const containerSize = direction ? height : width;
		const previousSplitter = activeSplitter ? splitters[activeSplitter - 1] : 0;
		const nextSplitter = activeSplitter === splitters.length - 1 ? containerSize : splitters[activeSplitter + 1];
				
		mousePosition = ensureEnoughSpaceBetweenSplitters(previousSplitter, mousePosition, nextSplitter, SPACE_BETWEEN, SPLITTER_SIZE);

		const newSplitters = [...splitters];
		newSplitters[activeSplitter] = mousePosition;
		
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
		const containerClass = classNames({
			'container': true,
			'container--vertical': this.state.direction,
			'container--horizontal': !this.state.direction,
			'container--resizing': this.state.resizing
		});

		const containerSize = this.state.direction ? this.state.height: this.state.width;
		const windowsSizes = getWindowsSizes(containerSize, this.state.splitters, SPLITTER_SIZE);

		const content = 
			windowsSizes
				.map((s, i) => {
					let arr = [
						<Window
						key={`w_${i}`} 
						height={this.state.direction ? s : null}
						width={!this.state.direction ? s : null} 
					/>
					];

					if (i !== windowsSizes.length - 1) {
						arr.push(
							<Splitter
								key={`S_${i}`}
								height={this.state.direction ? SPLITTER_SIZE : null}
								width={!this.state.direction ? SPLITTER_SIZE : null}
								handleMouseDown={() => this.startResize(i)}
							/>
						);
					}

					return arr;
				})
				.flatten();

		return (
			<div 
				ref={this.containerRef}
				className={containerClass}
				onMouseMove={this.resize}
				onMouseUp={this.stopResize}
				onKeyPress={this.changeDirection}
				tabIndex="1"
			>
				{content}
			</div>
		);
  }
}

export default Container;