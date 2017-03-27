import fe from '../Game.js';
import { register, unregister, registerMoveRect, registerAtkRect, unregisterMoveTiles } from '../project.js';

fe.calculateMove = function(c) {
  // Current character coords
  var col = c.col;
  var row = c.row;
  var tMap = fe.registry;
  var cw = fe.main.canvas.clientWidth;
  var pxPerCol = fe.pxPerCol;
  var pxPerRow = fe.pxPerRow;
  var ch = fe.main.canvas.clientHeight;
  var mv = c.mv;
  var atk = 1;
  var mvTotal = mv + atk;
  var matrixArr = [];
  var atkArr = [];

  for(var i=0; i <= mvTotal; i++) {
    for(var idx=0; idx<= mvTotal; idx++) {
      if(idx + i !== 0) {
        if(idx + i <= mv) {
          // If tile is within move limits
          matrixArr.push([idx, i]);
        } else if(idx + i > mv && idx + i <= mvTotal) {
          // If tile is within attack limits
          atkArr.push([idx, i]);
        }
      }
    }
  }

  var mvMatrix = buildMatrices(matrixArr);
  var atkMatrix = buildMatrices(atkArr);

  function buildMatrices(arr) {
    var arrCache = [];
    var newMatrix = [];
    arr.forEach(function(item) {
      var newItem = [];
      var cacheString = '';
      newItem[0] = col + item[0];
      newItem[1] = row + item[1];
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && col + item[0] <= fe.totalCols - 1 && col + item[0] >= 0 && row + item[1] <= fe.totalRows - 1) {
        arrCache.push(cacheString);
        newMatrix.push(newItem);
      }
      var newItem = [];
      newItem[0] = col - item[0];
      newItem[1] = row - item[1];
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && col - item[0] <= cw && fe.totalCols - 1 >= 0 && row - item[1] <= fe.totalRows - 1) {
        arrCache.push(cacheString);
        newMatrix.push(newItem);
      }
      var newItem = [];
      newItem[0] = col + item[0];
      newItem[1] = row - item[1];
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && col + item[0] <= fe.totalCols - 1 && col + item[0] >= 0 && row - item[1] <= fe.totalRows - 1) {
        arrCache.push(cacheString);
        newMatrix.push(newItem);
      }
      var newItem = [];
      newItem[0] = col - item[0];
      newItem[1] = row + item[1];
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && col - item[0] <= fe.totalCols && col - item[0] >= 0 && row + item[1] <= fe.totalRows) {
        arrCache.push(cacheString);
        newMatrix.push(newItem);
      }
    })
    return newMatrix;
  }

  mvMatrix = mvMatrix.filter(function(item) {
    if(fe.registry[item[1]] !== undefined && fe.registry[item[1]][item[0]] !== undefined && fe.registry[item[1]][item[0]].collide === true) {
      atkMatrix.push(item);
    } else {
      return item;
    }
  })
  return([mvMatrix, atkMatrix, col, row]);
}

fe.drawMoveRects = function(arr, c) {
  fe.moveContainer = new createjs.Container();
  arr.forEach(function(coord) {
    var rect = new createjs.Shape();
    rect.col = coord[0];
    rect.row = coord[1];
    rect.graphics.beginFill('rgba(92, 165, 225, .6)').drawRect(coord[0] * fe.pxPerCol, coord[1] * fe.pxPerRow, fe.pxPerCol - 1, fe.pxPerRow - 1);
    rect.movable = true;
    if(fe.registry[rect.row] && fe.registry[rect.row][rect.col] !== undefined) {
      registerMoveRect(rect);
      fe.moveContainer.addChild(rect);
    } else {
      return;
    }
  });
  fe.main.addChild(fe.moveContainer);
  fe.main.setChildIndex(fe.moveContainer, 1);
  fe.main.update();
}

fe.drawAtkRects = function(arr, c) {
  fe.moveContainer = fe.moveContainer ? fe.moveContainer : new createjs.Container();
  arr.forEach(function(coord) {
    var rect = new createjs.Shape();
    rect.col = coord[0];
    rect.row = coord[1];
    rect.graphics.beginFill('rgba(244, 67, 55, .6)').drawRect(coord[0] * fe.pxPerCol, coord[1] * fe.pxPerRow, fe.pxPerCol - 1, fe.pxPerRow - 1);
    rect.addEventListener('click', function(e) {
      handleRectClick(rect, e, c);
    });
    if(fe.registry[rect.row] && fe.registry[rect.row][rect.col] !== undefined) {
      registerAtkRect(rect);
      fe.moveContainer.addChild(rect);
    } else {
      return;
    }
  });
  fe.main.addChild(fe.moveContainer);
  fe.main.setChildIndex(fe.moveContainer, 1);
  fe.main.update();
}

fe.removeMoveMap = function() {
  fe.moveContainer.children.forEach(function(child) {
    unregisterMoveTiles(child);
  });
  fe.main.removeChild(fe.moveContainer);
  return;
}

fe.resetStage = function() {
  fe.characterSelected = false;
  fe.hoverSelect = fe.heroSelected;
  fe.heroSelected = undefined;
  fe.hero = {};
  fe.render(fe.main);
}

fe.calculateMoveSelect = function() {
  var hero = fe.heroSelected;
  if(fe.registry[fe.selector.row][fe.selector.col].requestMove(hero)) {
    console.log("Request Move True");
    unregister(hero);
    hero.col = fe.selector.col;
    hero.row = fe.selector.row;
    fe.removeMoveMap();
    register(hero);
    hero.getMoveMatrix(hero.col, hero.row);
    fe.update(fe.main, hero);
    fe.resetStage();
    console.log("Character Moved to row, col: " + hero.row + ', ' + hero.col);
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
