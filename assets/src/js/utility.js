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

fe.render = function(stage, child) {
  if(child) {
    if(child.col !== undefined && child.row !== undefined) {
      child.x = colsToPixels(child.col - 1);
      child.y = rowsToPixels(child.row - 1);
    }
    if(child.index !== undefined) {
      stage.setChildIndex(child, 2);
    }

    stage.addChild(child);
  }
  stage.update();
  return;
}

fe.update = function(stage, child) {
  child.x = colsToPixels(child.col);
  child.y = rowsToPixels(child.row);

  stage.update();
  return;
}

fe.renderChild = function(container, child) {
  if(child.col !== undefined && child.row !== undefined) {
    child.x = colsToPixels(child.col - 1);
    child.y = rowsToPixels(child.row - 1);
  }
  if(child.index !== undefined) {
    container.setChildIndex(child, 2);
  }

  container.addChild(child);
  return;
}
