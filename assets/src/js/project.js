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

  var brigand = {
    wid: 'brigand',
    posX: 70,
    posY: 25,
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
      attack: [0, 11, 'attack', .2]
    }
  };
  stage = new createjs.Stage('main');
  createBgStage(stageBg);
  buildImage(lynPath, lynData, 'start', createSpriteAnimation);
  buildImage(brigandPath, brigand, 'attack', createSpriteAnimation);
}

function createBgStage(bgi) {
  var owBrigand = {
    posRow: 2,
    posCol: 3,
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
    posRow: 8,
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
  sprite = window[data.wid];
  console.log(sprite);
  sprite.y = data.posY ? data.posY : 50;
  sprite.x = data.posX ? data.posX : 300;
  sprite.scaleX = scaleB;
  sprite.scaleY = scaleB;
  stage.addChild(sprite);
  stage.update();
  sprite.gotoAndStop(0);
}

function createOverworld(ss, action, data) {
  var owChar = new createjs.Sprite(ss, action);
  var gridX = 240 / 16;
  var gridY = 160 / 10;
  gridX = xStart / 16; // 240 * 1.5 = 360
  gridY = yStart / 10;
  owChar.scaleX = scale;
  owChar.scaleY = scale;
  if(data.posCol !== undefined && data.posRow !== undefined) {
    owChar.x = gridX * data.posCol;
    owChar.y = gridY * data.posRow;
  }
  console.log(owChar);
  bg.addChild(owChar);
  bg.update();
  owChar.gotoAndPlay('idle');
  window.setInterval(function() {
    bg.update();
  }, 1000);
}

function playSprite(action, obj) {
  sprite = obj ? obj : sprite;
  sprite.gotoAndPlay(0);
  createjs.Ticker.addEventListener("tick", function() {
    if(sprite.currentFrame > 4 && sprite.currentFrame < 12) {
      sprite.x = 70;
    } else {
      sprite.x = 170;
    }
    stage.update();
  });
}

function playSprite2() {
  if(brigand.currentFrame === 0) {
    brigand.gotoAndPlay('attack');
  } else {
    brigand.gotoAndPlay(brigand.currentFrame);
  }
  createjs.Ticker.addEventListener("tick", function() {
    if(brigand.currentFrame > 4 && brigand.currentFrame < 12) {
      brigand.x = 250;
    } else {
      brigand.x = 70;
    }
    stage.update();
  });
}

function stopSprite(action, obj) {
  sprite = obj ? obj : sprite;
  sprite.gotoAndStop(0);
  stage.update();
}

function stopSprite2() {
  brigand.gotoAndStop(brigand.currentFrame);
  stage.update();
}

function plusFrame() {
  brigand.gotoAndStop(brigand.currentFrame);
  brigand.currentFrame = brigand.currentFrame + 1;
  brigand.gotoAndStop(brigand.currentFrame);
  console.log(brigand.currentFrame);
  stage.update();
}

function minusFrame() {
  brigand.gotoAndStop(brigand.currentFrame);
  brigand.currentFrame = brigand.currentFrame - 1;
  brigand.gotoAndStop(brigand.currentFrame);
  console.log(brigand.currentFrame);
  stage.update();
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
