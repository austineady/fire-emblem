function createMoveMap(mv, col, row, c) {
  // Current character coords
  var cCalc = col * pxPerCol;
  var rCalc = row * pxPerRow;
  var cw = main.canvas.clientWidth;
  var ch = main.canvas.clientHeight;
  var matrixArr = [];
  var newMatrix = [];
  var arrCache = [];

  for(var i=0; i <= mv; i++) {
    for(var idx=0; idx<= mv; idx++) {
      if(idx + i <= mv && idx + i !== 0) {
        matrixArr.push([idx, i]);
      }
    }
  }

  matrixArr.forEach(function(item) {
    var newItem = [];
    var cacheString = '';
    newItem[0] = (col + item[0]) * pxPerCol;
    newItem[1] = (row + item[1]) * pxPerRow;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      arrCache.push(cacheString);
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col - item[0]) * pxPerCol;
    newItem[1] = (row - item[1]) * pxPerRow;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      arrCache.push(cacheString);
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col + item[0]) * pxPerCol;
    newItem[1] = (row - item[1]) * pxPerRow;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      arrCache.push(cacheString);
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col - item[0]) * pxPerCol;
    newItem[1] = (row + item[1]) * pxPerRow;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      arrCache.push(cacheString);
      newMatrix.push(newItem);
    }
    return;
  })
  //console.log(newMatrix);
  moveCache = newMatrix;

  drawMoveRects(newMatrix, c);
}

function drawMoveRects(arr, c) {
  fe.moveContainer = new createjs.Container();
  arr.forEach(function(coord) {
    var rect = new createjs.Shape();
    rect.posX = coord[0];
    rect.posY = coord[1];
    rect.col = coord[0] / pxPerCol;
    rect.row = coord[1] / pxPerRow;
    rect.graphics.beginFill('rgba(92, 165, 225, .6)').drawRect(coord[0], coord[1], pxPerCol - 1, pxPerRow - 1);
    rect.addEventListener('click', function(e) {
      handleRectClick(rect, e, c);
    });
    fe.moveContainer.addChild(rect);
  });
  main.addChild(fe.moveContainer);
  main.setChildIndex(fe.moveContainer, 1);
  main.update();
}

function handleMovement(x, y, c) {
  if(x !== 0) {
    moveX(x, c);
  }
  if(y !== 0) {
    moveY(y, c);
  }
}

function moveX(x, c) {
  if(x > 0) {
    // move right
    for(var i=1; i<=x; i++) {
      c.x = colsToPixels(c.col + i);
      fe.render(main);
    }
  } else {
    // move left
    for(var i = 1; i <= Math.abs(x); i++) {
      c.x = colsToPixels(c.col - i);
      fe.render(main);
    }
  }
  return;
}

function moveY(y, c) {
  if(y > 0) {
    // move down
    for(var i=1; i<=y; i++) {
      c.y = rowsToPixels(c.row + i);
      fe.render(main);
    }
  } else {
    // move up
    for(var i = 1; i <= Math.abs(y); i++) {
      c.y = rowsToPixels(c.row - i);
      fe.render(main);
    }
  }
  return;
}
