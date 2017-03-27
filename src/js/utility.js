import fe from './Game';

function _scale(item, s) {
  s = s ? s : fe.scale;
  item.scaleX = s;
  item.scaleY = s;
}

function rowsToPixels(r) {
  // pixels per row
  return fe.pxPerRow * r;
}

function pixelsToRows(p) {
  return Math.floor(p / fe.pxPerRow);
}

function colsToPixels(c) {
  // pixels per col
  return fe.pxPerCol * c;
}

function pixelsToCols(p) {
  return Math.floor(p / fe.pxPerCol);
}

// http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}



export { _scale, rowsToPixels, pixelsToCols, colsToPixels, pixelsToRows, isEmpty };
