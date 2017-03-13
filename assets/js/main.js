document.onload = createStage();
var stage;
var sprite;

function createStage() {
  var stageBg = 'assets/images/background/bg-map-1.png';
  var owPath = 'assets/images/overworld/overworld-characters-clean.png';
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

  var owData = {
    // image to use
    images: [],
    // width, height, count(optional), registration x, registration y
    frames: [
      // x, y, width, height, imageIndex, regX, regY
      [182, 165, 31, 31],
      [182, 197, 31, 31],
      [182, 229, 31, 31]
    ],
    animations: {
      rest: {
        frames: [0, 1, 2, 1, 0],
        next: 'rest',
        speed: 0.2
      }
    }
  };

  var lynData = {
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

  var owBrigand = {
    images: [],
    frames: [
      [0, 230, 17, 17],
      [23, 230, 17, 17],
      [46, 230, 17, 17]
    ],
    animations: {
      'idle': {
        frames: [0, 1, 2, 1, 0],
        next: 'idle',
        speed: 0.5
      }
    }
  };

  var brigand = {
    images: [],
    frames: [
      [7, 0, 36, 54],
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
      'idle': 0,
      'attack': [0, 11, 'idle', .5]
    }
  };
  stage = new createjs.Stage('main');
  setBackground(stageBg);
  //drawCircle();
  buildImage(lynPath, lynData, 'start', createSpriteAnimation);
  buildImage(brigandPath, owBrigand, 'idle', createOverworld);
  buildImage(owPath, owData, 'rest', createOverworld);
}

function setBackground(path) {
  var bitmap = new createjs.Bitmap(path);
  stage.addChild(bitmap);
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
  cb(ss, action);
}

function createSpriteAnimation(ss, action) {
  sprite = new createjs.Sprite(ss);
  console.log(sprite);
  sprite.y = 50;
  stage.addChild(sprite);
  sprite.x = 170;
  stage.update();
  sprite.gotoAndStop(0);
}

function createOverworld(ss, action) {
  var owChar = new createjs.Sprite(ss, action);
  stage.addChild(owChar);
  stage.update();
  owChar.gotoAndPlay(action);
  createjs.Ticker.addEventListener("tick", function() {
    stage.update();
  });
  createjs.Ticker.setInterval(250);
}

function playSprite(action, obj) {
  sprite = obj ? obj : sprite;
  sprite.gotoAndPlay(action);
  createjs.Ticker.addEventListener("tick", function() {
    if(sprite.currentFrame > 4 && sprite.currentFrame < 12) {
      sprite.x = 70;
    } else {
      sprite.x = 170;
    }
    stage.update();
  });
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
