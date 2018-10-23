import '../extensions/array';

let getWindowsSizes = (containerSize, splitters) => {
  let windowsSizes = splitters.map((s, i) => {
    if (i === 0) {
      return s;
    } else {
      return splitters[i] - splitters[i -1];
    }
  });

  windowsSizes.push(containerSize - splitters.last());

  return windowsSizes;
}

export { getWindowsSizes };