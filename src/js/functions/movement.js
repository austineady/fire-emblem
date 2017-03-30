import fe from '../Game.js';
import { register, unregister, registerMoveRect, registerAtkRect, unregisterMoveTiles } from '../project.js';
import { _scale } from '../utility';

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
  fe.hero = null;
  fe.render(fe.main);
}

fe.calculateMoveSelect = function() {
  var hero = fe.heroSelected;
  if(fe.registry[fe.selector.row][fe.selector.col].requestMove(hero)) {
    // Character has moved, show turn options
    hero.col = fe.selector.col === hero.col ? hero.col : fe.selector.col;
    hero.row = fe.selector.row === hero.row ? hero.row : fe.selector.row;
    fe.update(fe.main, fe.heroSelected);
    console.log("Character Moved to row, col: " + hero.row + ', ' + hero.col);
    showUserMenu(hero);
  }
}

function showUserMenu(c) {
  fe.userMenu = new createjs.Container();
  var opts = getUserOptions(c);
  var userMenuBg = new createjs.Shape(new createjs.Graphics().setStrokeStyle(1).beginStroke('rgba(247, 246, 183, 1.00)').beginFill('rgba(89, 91, 189, .9)').drawRect(0, 0, 45, opts.length * 14));
  fe.userMenu.addChild(userMenuBg);

  opts.forEach(function(option, index) {
    var optionText = new createjs.Text(option, '500 9px Quicksand, sans-serif', '#fff');
    optionText.shadow = new createjs.Shadow('#000', 0, 0, 5);

    var textContainer = new createjs.Container();
    textContainer.addChild(optionText);
    var textY = index > 0 ? 7 * (index + 1) : 2;
    textContainer.setBounds(5, textY, 45, 9);
    textContainer.y = textY;
    textContainer.x = 5;
    textContainer.height = 9;
    textContainer.width = 45;
    fe.userMenu.addChild(textContainer);
    return;
  })
  fe.userMenu.x = (fe.selector.col - 3) * fe.pxPerCol;
  fe.userMenu.y = (fe.selector.row - 1) * fe.pxPerRow;
  fe.userMenu.selectorIndex = 1;
  fe.userMenu.optsLength = opts.length;
  var xVal = fe.userMenu.children[fe.userMenu.selectorIndex].x - 10;
  var yVal = fe.userMenu.children[fe.userMenu.selectorIndex].height / 2 + 2;
  fe.menuSelector = new createjs.Shape(new createjs.Graphics().setStrokeStyle(1).beginStroke('#000').beginFill("#fff").drawPolyStar(xVal,yVal,5,3,2,0));
  console.log(fe.userMenu.children[fe.userMenu.selectorIndex]);
  fe.userMenu.children[fe.userMenu.selectorIndex].addChild(fe.menuSelector);

  _scale(fe.userMenu);
  fe.render(fe.main, fe.userMenu);
  fe.userMenuActive = true;

  fe.userMenu.update = function(y) {
    fe.userMenu.children[fe.userMenu.selectorIndex].removeChild(fe.menuSelector);
    fe.userMenu.children[y].addChild(fe.menuSelector);
    fe.userMenu.selectorIndex = y;
    fe.render(fe.main);
  }
}

fe.hideUserMenu = function() {
  fe.main.removeChild(fe.userMenu);
  fe.userMenuActive = false;
}

function getUserOptions(c) {
  // Will need to be changed to account for range
  var tileBottom = fe.registry[fe.selector.row - 1][fe.selector.col];
  var tileTop = fe.registry[fe.selector.row + 1][fe.selector.col];
  var tileLeft = fe.registry[fe.selector.row][fe.selector.col - 1];
  var tileRight = fe.registry[fe.selector.row][fe.selector.col + 1];
  var tiles = [tileBottom, tileTop, tileLeft, tileRight];
  var opts = [];
  console.log(tiles);

  tiles.forEach(function(tile) {
    if(tile.atkTile && tile.character !== null && tile.character.enemy) {
      // First Check for Attack
      if(opts.indexOf('Attack') === -1) {
        opts.push('Attack');
      }
    } else if(tile.character !== null && !tile.character.enemy) {
      // Eventually check for constitution
      opts.push('Rescue', 'Item', 'Trade', 'Wait');
    }
  })

  if(opts.indexOf('Item') === -1 && opts.indexOf('Wait') === -1) {
    opts.push('Item', 'Wait');
  }
  return opts;
}

fe.endHeroTurn = function() {
  var hero = fe.heroSelected;
  unregister(hero);
  fe.removeMoveMap();
  hero.col = fe.selector.col;
  hero.row = fe.selector.row;
  register(hero);
  hero.getMoveMatrix(hero.col, hero.row);
  fe.update(fe.main, hero);
  fe.resetStage();
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
