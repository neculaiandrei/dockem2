import '../extensions/array';

let getWindowsSizes = (containerSize, splitters, splitterSize) => {
  let windowsSizes = splitters.map((s, i) => {
    if (i === 0) {
      return s;
    } else {
      return splitters[i] - splitters[i -1] - splitterSize;
    }
  });

  var lastWindowSize = containerSize - splitters.last() - splitterSize;
  windowsSizes.push(lastWindowSize);

  return windowsSizes;
}

let ensureEnoughSpaceBetweenSplitters = (fixedA, moving, fixedB, space, splitterSize) => {
  if (fixedA === 0) {
    splitterSize = 0;
  }

  if (moving - space - splitterSize < fixedA) {
    moving = fixedA + space + splitterSize;
  }

  if (moving + space + splitterSize > fixedB) {
    moving = fixedB - space - splitterSize;
  }

  return moving;
}

export { getWindowsSizes, ensureEnoughSpaceBetweenSplitters };