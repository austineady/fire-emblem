import { scale, xStart, yStart } from './project.js';

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

// http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function render(stage, child) {
  if(child) {
    if(child.col !== undefined && child.row !== undefined) {
      child.x = colsToPixels(child.col);
      child.y = rowsToPixels(child.row);
    }
    if(child.index !== undefined) {
      stage.setChildIndex(child, 2);
    }

    stage.addChild(child);
  }
  stage.update();
  return;
}

function update(stage, child) {
  child.x = colsToPixels(child.col);
  child.y = rowsToPixels(child.row);

  stage.update();
  return;
}

function renderChild(container, child) {
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

export { _scale, rowsToPixels, pixelsToCols, colsToPixels, pixelsToRows, isEmpty, render, update, renderChild };
