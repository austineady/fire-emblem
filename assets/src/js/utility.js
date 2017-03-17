function _scale(item, s) {
  s = s ? s : scale;
  item.scaleX = s;
  item.scaleY = s;
}

function rowsToPixels(r) {
  // pixels per row
  var pxPerRow = yStart / 10;

  return pxPerRow * r;
}

function pixelsToRows(p) {
  return Math.floor(p / pxPerRow);
}

function colsToPixels(c) {
  // pixels per col
  var pxPerCol = xStart / 15;

  return pxPerCol * c;
}

function pixelsToCols(p) {
  return Math.floor(p / pxPerCol);
}

fe.render = function(stage) {
  stage.update();
}