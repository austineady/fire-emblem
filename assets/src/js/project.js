//=require functions.js

var stage,
    bg;

var ratio = 1.5,
    scale = 2,
    scaleB = 1.5,
    xStartB = 240 * scaleB,
    yStartB = xStartB / ratio,
    xStart = 240 * scale,
    yStart = xStart / ratio;

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

  var y1 = 23;
  var y2 = 85;
  var ht = 53;
  var iidx = 0;
  var regX = 500;
  var regY = 0;
  var regXe = 400;

  var lynData = {
    wid: 'lyn',
    // image to use
    images: [],
    // width, height, count(optional), registration x, registration y
    frames: [
      // x, y, width, height, imageIndex, regX, regY
      // start
      [12, y1, 21, ht],
      [43, y1, 21, ht],
      [72, y1, 23, ht],
      // hold
      [106, y1, 27, ht],
      [106, y1, 27, ht],
      // strike
      [147, y1, 52, ht],
      [224, y1, 63, ht],
      // wait
      [308, y1, 45, ht],
      [308, y1, 45, ht],
      [308, y1, 45, ht],
      // jump
      [366, y1, 40, ht],
      // air
      [417, y1, 54, ht],
      [417, y1, 54, ht],
      [417, y1, 54, ht],
      // land
      [0, y2, 29, ht],
      [43, y2, 28, ht],
      [82, y2, 28, ht],
      [82, y2, 28, ht],
      [125, y2, 25, ht],
      [156, y2, 38, ht],
      // end
      [204, y2, 29, ht],
      [244, y2, 29, ht],
      [284, y2, 23, ht],
      [315, y2, 23, ht],
      [351, y2, 24, ht],
      [386, y2, 21, ht],
      [417, y2, 21, ht],
      [450, y2, 21, ht]
    ],
    animations: {
      idle: 0,
      start: [0, 2, 'hold', .5],
      hold: [3, 4, 'strike', .3],
      strike: [5, 6, 'wait', 1],
      wait: [7, 9, 'jump', .3],
      jump: [10, 11, 'air', .5],
      air: [11, 13, 'land', .3],
      land: [14, 19, 'end', .6],
      end: [20, 27, 'idle', .6]
    }
  };

  var lynLoopData = {
    wid: 'lyn',
    posY: 40,
    posX: 230,
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
}

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
  //bg.addEventListener('click', handleStageClick);
  setBackground(bgi);
  buildImage(owPath, owLynData, 'idle', createOverworld);
  buildImage(brigandPath, owBrigand, 'idle', createOverworld);
}

function handleStageClick(e) {
  console.log(e);
  var xCalc = xStart / 15;
  var yCalc = yStart / 10;
  var rectCol = Math.floor(e.stageX / xCalc);
  var rectRow = Math.floor(e.stageY / yCalc);
  var col = rectCol * xCalc;
  var row = rectRow * yCalc;
  console.log(rectRow);
  console.log(rectCol);
  // var rect = new createjs.Shape();
  // rect.graphics.beginFill('rgba(241, 68, 54, .6)').drawRect(col, row, xCalc, yCalc);

  createMoveMap(5, rectCol, rectRow, xCalc, yCalc);
}

function createMoveMap(mv, col, row, w, h) {
  // Current character coords
  var cCalc = col * w;
  var rCalc = row * h;
  var cw = bg.canvas.clientWidth;
  var ch = bg.canvas.clientHeight;
  var matrixArr = [];
  for(var i=0; i <= mv; i++) {
    for(var idx=0; idx<= mv; idx++) {
      if(idx + i <= mv && idx + i !== 0) {
        matrixArr.push([idx, i]);
      }
    }
  }
  var newMatrix = [];
  matrixArr.forEach(function(item) {
    var newItem = [];
    newItem[0] = (col + item[0]) * w;
    newItem[1] = (row + item[1]) * h;
    if(newMatrix.indexOf(newItem) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col - item[0]) * w;
    newItem[1] = (row - item[1]) * h;
    if(newMatrix.indexOf(newItem) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col + item[0]) * w;
    newItem[1] = (row - item[1]) * h;
    if(newMatrix.indexOf(newItem) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      newMatrix.push(newItem);
    }
    newItem = [];
    newItem[0] = (col - item[0]) * w;
    newItem[1] = (row + item[1]) * h;
    if(newMatrix.indexOf(newItem) === -1 && newItem[0] < cw && newItem[0] > 0 && newItem[1] < ch) {
      newMatrix.push(newItem);
    }
    return;
  })
  console.log(newMatrix);

  drawMoveRects(newMatrix, w, h);
}

function drawMoveRects(arr, w, h) {
  console.log(arr);
  arr.forEach(function(coord) {
    var rect = new createjs.Shape();
    rect.posX = coord[0];
    rect.posY = coord[1];
    rect.col = coord[0] / w;
    rect.row = coord[1] / h;
    rect.graphics.beginFill('rgba(92, 165, 225, .6)').drawRect(coord[0], coord[1], w - 1, h - 1);
    bg.addChild(rect);
    console.log(rect);
  });
  bg.update();
}

function setBackground(path) {
  var bitmap = new createjs.Bitmap(path);
  bitmap.scaleX = scale;
  bitmap.scaleY = scale;
  bg.addChild(bitmap);
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
  sprite = window[data.wid];
  sprite.y = data.posY ? data.posY : 0;
  sprite.x = data.posX ? data.posX : 0;
  sprite.scaleX = scaleB;
  sprite.scaleY = scaleB;
  stage.addChild(sprite);
  renderDisplay(sprite);
  sprite.gotoAndStop(0);
}

function createOverworld(ss, action, data) {
  var owChar = new createjs.Sprite(ss, action);
  var gridX = 240 / 15;
  var gridY = 160 / 10;
  gridX = xStart / 15; // 240 * 1.5 = 360
  gridY = yStart / 10;
  owChar.scaleX = scale;
  owChar.scaleY = scale;
  if(data.posCol !== undefined && data.posRow !== undefined) {
    owChar.x = gridX * (data.posCol - 1);
    owChar.y = gridY * (data.posRow - 1);
  }
  owChar.addEventListener('click', handleStageClick);
  console.log(owChar);
  bg.addChild(owChar);
  bg.update();
  owChar.gotoAndPlay('idle');
  window.setInterval(function() {
    bg.update();
  }, 1000);
}

function playSprite() {
  lyn.gotoAndPlay('start');
  createjs.Ticker.addEventListener("tick", function() {
    renderDisplay(lyn);
  });
}

function playSprite2() {
  if(brigand.currentFrame === 0) {
    brigand.gotoAndPlay('attack');
  } else {
    brigand.gotoAndPlay(brigand.currentFrame);
  }
  createjs.Ticker.addEventListener("tick", function() {
    if(brigand.currentFrame == 4) {
      brigand.y = -10;
      brigand.x = 80;
    } else if(brigand.currentFrame == 5) {
      brigand.x = 140;
    } else if(brigand.currentFrame == 6) {
      brigand.x = 190;
    } else if(brigand.currentFrame == 7 || brigand.currentFrame == 8) {
      brigand.x = 190;
      brigand.y = 15;
    } else if(brigand.currentFrame == 9) {
      brigand.x = 150;
      brigand.y = -5;
    } else if(brigand.currentFrame == 10) {
      brigand.x = 120;
      brigand.y = -15;
    } else if(brigand.currentFrame == 11) {
      brigand.x = 90;
      brigand.y = -15;
    } else {
      brigand.x = 70;
      brigand.y = 25;
    }
    renderDisplay(brigand);
  });
}

function stopSprite(action, obj) {
  sprite = obj ? obj : sprite;
  sprite.gotoAndStop(0);
  stage.update(lyn);
}

function stopSprite2() {
  brigand.gotoAndStop(brigand.currentFrame);
  renderDisplay(brigand);
}

function plusFrame(c) {
  var char = window[c];
  char.gotoAndStop(char.currentFrame);
  char.currentFrame = char.currentFrame + 1;
  char.gotoAndStop(char.currentFrame);
  renderDisplay(char);
}

function minusFrame(c) {
  var char = window[c];
  char.gotoAndStop(char.currentFrame);
  char.currentFrame = char.currentFrame - 1;
  char.gotoAndStop(char.currentFrame);
  renderDisplay(char);
}

function renderDisplay(c) {
  var fd = document.getElementById(c.wid + '-current-frame');
  var xd = document.getElementById(c.wid + '-x-offset');
  var yd = document.getElementById(c.wid + '-y-offset');
  fd.textContent = c.currentFrame;
  modifyLynX(c.currentFrame);
  if(xd.value.length === 0 && yd.value.length === 0) {
    xd.value = c.x;
    yd.value = c.y;
  }
  stage.update();
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

function handleYOffsetChange(e, c) {
  window[c].y = e.value;
  renderDisplay(window[c]);
}

function handleXOffsetChange(e, c) {
  window[c].x = e.value;
  renderDisplay(window[c]);
}

function handleImageLoad(e) {
  console.log('Image Loaded:');
  console.log(e);
}

function handleImageError(e) {
  console.error('Image Error');
  console.log(e);
}

function drawCircle() {
  var circle = new createjs.Shape();
  // drawCircle(x, y, radius)
  circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  renderStage();
}

function renderStage() {
  stage.update();
}
