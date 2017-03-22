function createMoveMap(c) {
  // Current character coords
  var col = c.col - 1;
  var row = c.row - 1;
  var mv = c.mv;
  var cCalc = col * pxPerCol;
  var rCalc = row * pxPerRow;
  var cw = main.canvas.clientWidth;
  var ch = main.canvas.clientHeight;
  var matrixArr = [];
  var newMatrix = [];
  var atkMatrix = [];
  var arrCache = [];
  var mvTotal = mv + 1;

  for(var i=0; i <= mvTotal; i++) {
    for(var idx=0; idx<= mvTotal; idx++) {
      if(idx + i <= mvTotal && idx + i !== 0) {
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
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
      arrCache.push(cacheString);
      if(item[0] + item[1] < mvTotal) {
        newMatrix.push(newItem);
      } else {
        atkMatrix.push(newItem);
      }
    }
    newItem = [];
    newItem[0] = (col - item[0]) * pxPerCol;
    newItem[1] = (row - item[1]) * pxPerRow;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
      arrCache.push(cacheString);
      if(item[0] + item[1] < mvTotal) {
        newMatrix.push(newItem);
      } else {
        atkMatrix.push(newItem);
      }
    }
    newItem = [];
    newItem[0] = (col + item[0]) * pxPerCol;
    newItem[1] = (row - item[1]) * pxPerRow;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
      arrCache.push(cacheString);
      if(item[0] + item[1] < mvTotal) {
        newMatrix.push(newItem);
      } else {
        atkMatrix.push(newItem);
      }
    }
    newItem = [];
    newItem[0] = (col - item[0]) * pxPerCol;
    newItem[1] = (row + item[1]) * pxPerRow;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
      arrCache.push(cacheString);
      if(item[0] + item[1] < mvTotal) {
        newMatrix.push(newItem);
      } else {
        atkMatrix.push(newItem);
      }
    }
    return;
  })
  //console.log(newMatrix);
  //console.log(atkMatrix);
  moveCache = newMatrix;

  drawMoveRects(newMatrix, c);
  drawAtkRects(atkMatrix, c);
  fe.characterSelected = true;
}

function drawMoveRects(arr, c) {
  fe.moveContainer = new createjs.Container();
  arr.forEach(function(coord) {
    var rect = new createjs.Shape();
    rect.col = coord[0] / pxPerCol + 1;
    rect.row = coord[1] / pxPerRow + 1;
    rect.graphics.beginFill('rgba(92, 165, 225, .6)').drawRect(coord[0], coord[1], pxPerCol - 1, pxPerRow - 1);
    rect.empty = true;
    register(rect);
    fe.moveContainer.addChild(rect);
  });
  main.addChild(fe.moveContainer);
  main.setChildIndex(fe.moveContainer, 1);
  main.update();
}

function drawAtkRects(arr, c) {
  fe.moveContainer = fe.moveContainer ? fe.moveContainer : new createjs.Container();
  arr.forEach(function(coord) {
    var rect = new createjs.Shape();
    rect.col = coord[0] / pxPerCol;
    rect.row = coord[1] / pxPerRow;
    rect.graphics.beginFill('rgba(244, 67, 55, .6)').drawRect(coord[0], coord[1], pxPerCol - 1, pxPerRow - 1);
    rect.addEventListener('click', function(e) {
      handleRectClick(rect, e, c);
    });
    fe.moveContainer.addChild(rect);
  });
  main.addChild(fe.moveContainer);
  main.setChildIndex(fe.moveContainer, 1);
  main.update();
}

function removeMoveMap() {
  fe.moveContainer.children.forEach(function(child) {
    unregister(child);
  });
  main.removeChild(fe.moveContainer);
  return;
}

function resetStage() {
  fe.characterSelected = false;
  fe.hoverSelect = fe.heroSelected;
  fe.heroSelected = undefined;
  hero = {};
  fe.render(main);
}

function calculateMoveSelect() {
  var hero = fe.heroSelected;
  var colMem = hero.col;
  var rowMem = hero.row;
  if(fe.registry[selector.col + ', ' + selector.row] && fe.registry[selector.col + ', ' + selector.row].empty) {
    unregister(hero);
    hero.col = selector.col;
    hero.row = selector.row;
    removeMoveMap();
    register(hero);
    hero.getMoveMatrix(hero.col, hero.row);
    fe.render(main, hero);
    resetStage();
  }
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
      c.col += i;
      fe.update(main, c);
    }
  } else {
    // move left
    for(var i = 1; i <= Math.abs(x); i++) {
      c.col -= i;
      fe.update(main, c);
    }
  }
  return;
}

function moveY(y, c) {
  if(y > 0) {
    // move down
    for(var i=1; i<=y; i++) {
      c.row += i;
      fe.update(main, c);
    }
  } else {
    // move up
    for(var i = 1; i <= Math.abs(y); i++) {
      c.row -= i;
      fe.update(main, c);
    }
  }
  return;
}
