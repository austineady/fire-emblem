//=require functions.js
//=require ui-functions.js

var stage,
    bg,
    hero,
    moveCache = [];

var ratio = 1.5,
    scale = 2,
    scaleB = 1.5,
    xStartB = 240 * scaleB,
    yStartB = xStartB / ratio,
    xStart = 240 * scale,
    yStart = xStart / ratio,
    xCalc = xStart / 15,
    yCalc = yStart / 10;

document.onload = createStage();

function createStage() {
  var bge = document.getElementById('bg');
  var main = document.getElementById('main');
  main.width = xStartB;
  main.height = yStartB;
  bge.width = xStart;
  bge.height = yStart;
  var stageBg = 'assets/images/background/bg-map-1.png';
  var tanaPath = 'sprites/tana_pegasus_knight_lance_long.png';
  var lynPath = 'assets/images/animations/hero/lyn-clean.png';
  var lynLoop = 'assets/images/animations/hero/lyn-loop.png';
  var brigandPath = 'assets/images/animations/enemy/brigand-clean.png';

  // var y1 = 23;
  // var y2 = 85;
  // var ht = 53;
  // var iidx = 0;
  // var regX = 500;
  // var regY = 0;
  // var regXe = 400;

  var lynLoopData = {
    wid: 'lyn',
    posY: 40,
    posX: 230,
    row: 9,
    col: 15,
    mv: 3,
    // image to use
    images: [],
    // width, height, count(optional), registration x, registration y
    frames: {width:64, height:64, count:22, regX:0, regY:0},
    animations: {
      idle: 0,
      start: {
        frames: [0, 2],
        next: 'hold',
        speed: .3
      },
      hold: {
        frames: 3,
        next: 'strike',
        speed: .1
      },
      strike: {
        frames: [4, 6],
        next: 'wait',
        speed: .5
      },
      wait: {
        frames: 7,
        next: 'jump',
        speed: .1
      },
      jump: {
        frames: 8,
        next: 'air',
        speed: .6
      },
      air: {
        frames: 9,
        next: 'land',
        speed: .2
      },
      land: {
        frames: [10, 13],
        next: 'sheathe',
        speed: .4
      },
      sheathe: {
        frames: [14, 20],
        next: 'end',
        speed: .3
      },
      end: {
        frames: [21, 22],
        next: 'idle',
        speed: .1
      }
    }
  };

  var brigand = {
    wid: 'brigand',
    posX: 150,
    posY: 25,
    mv: 4,
    images: [],
    frames: [
      [3, 0, 38, 54],
      [46, 0, 38, 54],
      [94, 0, 36, 54],
      [140, 0, 36, 54],
      [188, 0, 38, 74],
      [236, 0, 41, 59],
      [281, 0, 41, 59],
      [326, 0, 43, 56],
      [374, 0, 41, 56],
      [418, 0, 42, 56],
      [0, 60, 31, 59],
      [41, 60, 26, 54]
    ],
    animations: {
      idle: 0,
      attack: [0, 1, 'twist', .4],
      twist: [1, 4, 'jump', .7],
      jump: [5, 5, 'strike', .7],
      strike: [6, 7, 'retreat', .5],
      retreat: [8, 9, 'land', .4],
      land: [10, 11, 'idle', .4]
    }
  };
  stage = new createjs.Stage('main');
  createBgStage(stageBg);
  buildImage(lynLoop, lynLoopData, 'start', createSpriteAnimation);
  buildImage(brigandPath, brigand, 'attack', createSpriteAnimation);
};

function createBgStage(bgi) {
  var owBrigand = {
    posRow: 3,
    posCol: 4,
    images: [],
    frames: [
      [0, 230, 17, 17],
      [23, 230, 17, 17],
      [46, 230, 17, 17]
    ],
    animations: {
      'idle': {
        frames: [0, 1, 2, 1],
        next: 'idle',
        framerate: 2
      }
    }
  };

  var owLynData = {
    posRow: 9,
    posCol: 14,
    // image to use
    images: [],
    // width, height, count(optional), registration x, registration y
    frames: [
      // x, y, width, height, imageIndex, regX, regY
      [189, 171, 16, 16],
      [189, 203, 16, 16],
      [189, 235, 16, 16]
    ],
    animations: {
      'idle': {
        frames: [0, 2, 1, 0],
        next: 'idle',
        framerate: 2
      }
    }
  };

  var brigandPath = 'assets/images/animations/enemy/brigand-clean.png';
  var owPath = 'assets/images/overworld/overworld-characters-clean.png';

  bg = new createjs.Stage('bg');
  setBackground(bgi);
  buildImage(owPath, owLynData, 'idle', createOverworld);
  buildImage(brigandPath, owBrigand, 'idle', createOverworld);
}

function handleStageClick(char, e) {
  var rectCol = pixelsToCols(e.stageX);
  var rectRow = pixelsToRows(e.stageY);
  char.col = rectCol;
  char.row = rectRow;
  hero = char;

  createMoveMap(5, rectCol, rectRow, char);
}

function createMoveMap(mv, col, row, c) {
  // Current character coords
  var cCalc = col * xCalc;
  var rCalc = row * yCalc;
  var cw = bg.canvas.clientWidth;
  var ch = bg.canvas.clientHeight;
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
    newItem[0] = (col + item[0]) * xCalc;
    newItem[1] = (row + item[1]) * yCalc;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      arrCache.push(cacheString);
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col - item[0]) * xCalc;
    newItem[1] = (row - item[1]) * yCalc;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      arrCache.push(cacheString);
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col + item[0]) * xCalc;
    newItem[1] = (row - item[1]) * yCalc;
    cacheString = newItem[0] + ', ' + newItem[1];
    if(arrCache.indexOf(cacheString) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      arrCache.push(cacheString);
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col - item[0]) * xCalc;
    newItem[1] = (row + item[1]) * yCalc;
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
  arr.forEach(function(coord) {
    var rect = new createjs.Shape();
    rect.posX = coord[0];
    rect.posY = coord[1];
    rect.col = coord[0] / xCalc;
    rect.row = coord[1] / yCalc;
    rect.graphics.beginFill('rgba(92, 165, 225, .6)').drawRect(coord[0], coord[1], xCalc - 1, yCalc - 1);
    rect.addEventListener('click', function(e) {
      handleRectClick(rect, e, c);
    });
    bg.addChild(rect);
    bg.setChildIndex(rect, 1);
  });
  bg.update();
}

function handleRectClick(rect, e, c) {
  var targetCol = rect.col;
  var targetRow = rect.row;

  var colDiff = targetCol - hero.col;
  var rowDiff = targetRow - hero.row;

  handleMovement(colDiff, rowDiff, c);
}

function handleMovement(x, y, c) {
  console.log(c);
  moveX(x, c, function() {
    moveY(y, c);
  });

  if(y > 0) {
    // move down
    for(var i=1; i<=y; i++) {
      c.y = rowsToPixels(c.row + i);

      bg.update();
    }
  } else {
    // move up
    for(var i=1; i<=Math.abs(y); i++) {
      c.y = rowsToPixels(c.row - i);

      bg.update();
    }
  }
}

function moveX(x, c, cb) {
  if(x > 0) {
    // move right
    for(var i=1; i<=x; i++) {
      c.x = colsToPixels(c.col + i);

      bg.update();
    }
  } else {
    // move left
    for(var i = 1; i <= Math.abs(x); i++) {
      c.x = colsToPixels(c.col - i);
      bg.update();
    }
  }
  return cb;
}

function setBackground(path) {
  var bitmap = new createjs.Bitmap(path);
  _scale(bitmap);
  bg.addChild(bitmap);
  bg.setChildIndex(bitmap, -1);
}

function buildImage(path, data, action, cb) {
  var img = new Image();
  img.src = path;
  img.onload = function() {
    createSpriteSheet(img, data, action, cb);
  };
}

function createSpriteSheet(img, data, action, cb) {
  data.images.push(img);
  var ss = new createjs.SpriteSheet(data);
  cb(ss, action, data);
}

function createSpriteAnimation(ss, action, data) {
  window[data.wid] = new createjs.Sprite(ss);
  window[data.wid].wid = data.wid;
  window[data.wid].mv = data.mv;
  var sprite = window[data.wid];
  sprite.y = data.posY ? data.posY : 0;
  sprite.x = data.posX ? data.posX : 0;
  _scale(sprite, scaleB);
  stage.addChild(sprite);
  renderDisplay(sprite);
  sprite.gotoAndStop(0);
}

function createOverworld(ss, action, data) {
  var owChar = new createjs.Sprite(ss, action);
  _scale(owChar);
  if(data.posCol !== undefined && data.posRow !== undefined) {
    owChar.x = colsToPixels(data.posCol - 1);
    owChar.y = rowsToPixels(data.posRow - 1);
  }
  owChar.addEventListener('click', function(e) {
    if(moveCache.length === 0) {
      handleStageClick(owChar, e);
    }
  });
  console.log(owChar);
  bg.addChild(owChar);
  bg.setChildIndex(owChar, 2);
  bg.update();
  if(moveCache.length !== 0) {
    drawMoveRects(moveCache);
  }
  owChar.gotoAndPlay('idle');
  window.setInterval(function() {
    bg.update();
  }, 1000);
}

function modifyLynX(f) {
  switch(f) {
    case 4:
      lyn.x = 200;
      break;
    case 5:
      lyn.x = 170;
      break;
    case 6:
    case 7:
    case 8:
      lyn.x = 200;
      break;
    default:
      lyn.x = 230;
      break;
  }
  return;
}

function _scale(item, s) {
  s = s ? s : scale;
  item.scaleX = s;
  item.scaleY = s;
}

function rowsToPixels(r) {
  // pixels per row
  var yCalc = yStart / 10;

  return yCalc * r;
}

function pixelsToRows(p) {
  return Math.floor(p / yCalc);
}

function colsToPixels(c) {
  // pixels per col
  var xCalc = xStart / 15;

  return xCalc * c;
}

function pixelsToCols(p) {
  return Math.floor(p / xCalc);
}
