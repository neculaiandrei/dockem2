import React, { Component } from 'react';

class MouseTracker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			width: 0,
			direction: DIRECTION.horizontal,
			resizing: false,
			activeSplitter: 1,
			splitters: [200, 420, 640, 760]
		};
		this.isHorizontal = true;
		this.isVertical = false;
		
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

		this.containerSize = this.isVertical ? height: width;
	}

	changeDirection(event) {
		if (event.key === 'h') {
			this.setState({
				direction: DIRECTION.horizontal
			});
			this.containerSize = this.state.width;
			this.isHorizontal = true;
		} else if (event.key === 'v') {
			this.setState({
				direction: DIRECTION.vertical
			});
			this.containerSize = this.state.height;
			this.isVertical = true;
		}
	}

	resize(event) {
		const { resizing, splitters, activeSplitter } = this.state;

		if (!resizing) {
			return;
		}

		let mousePosition = this.isVertical ? event.clientY : event.clientX;
		const previousSplitter = activeSplitter ? splitters[activeSplitter - 1] : 0;
		const nextSplitter = activeSplitter === splitters.length - 1 ? this.containerSize : splitters[activeSplitter + 1];
				
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
		const { resizing, splitters } = this.state;

		const containerClass = classNames({
			'container': true,
			'container--vertical': this.isVertical,
			'container--horizontal': this.isHorizontal,
			'container--resizing': resizing
		});

		const windowsSizes = getWindowsSizes(this.containerSize, splitters, SPLITTER_SIZE);

		const content = 
			windowsSizes
				.map((s, i) => {
					let arr = [
						<Window
						key={`w_${i}`} 
						height={this.isVertical ? s : null}
						width={this.isHorizontal ? s : null} 
					/>
					];

					if (i !== windowsSizes.length - 1) {
						arr.push(
							<Splitter
								key={`S_${i}`}
								height={this.isVertical ? SPLITTER_SIZE : null}
								width={this.isHorizontal ? SPLITTER_SIZE : null}
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

export default MouseTracker;