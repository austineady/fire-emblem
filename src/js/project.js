import '../scss/project.scss';
import fe from './Game';

import { _scale, rowsToPixels, pixelsToCols, colsToPixels, pixelsToRows, isEmpty } from './utility';
import { bindSelector, handleStageClick } from './functions/selector.js';
//import * as ui from './ui-functions';
import Lyn from './models/Lyn.js';
import Brigand from './models/Brigand.js';
import Tile from './models/Tile.js';
import * as movement from './functions/movement.js';
import * as hud from './functions/hud.js';
import Map from './maps/Map_0.js';
import Mugshot from './functions/mugshot.js';

document.onload = createStage();

function createStage() {
  var el = document.getElementById('main');
  el.width = fe.xStart;
  el.height = fe.yStart;
  createTiles(Map.level0.terrain);
  setBackground(Map.level0.background);
  createOverworldCharacters();
  createOverworldSheets();
  fe.createSelector();
  window.setTimeout(fe.handleSelector, 100);
  createjs.Ticker.addEventListener("tick", function (event) {
      // Actions carried out each tick (aka frame)
      fe.render(fe.main);
      if (!event.paused) {
          // Actions carried out when the Ticker is not paused.
      }
  });
  createjs.Ticker.framerate = 4;
};

function createTiles(tmap) {
  for(var i = 0; i < 10; i++) {
    var rowArray = [];
    var row = tmap[i];
    for(var idx = 0; idx < 15; idx++) {
      var col = row[idx];
      var tile = new Tile(idx, i, ('t' + col));
      rowArray.push(tile);
    }
    fe.registry.push(rowArray);
  }
}

function createOverworldCharacters() {
  buildSheet(Lyn).then(function(ss) {
    createOverworld(ss, 'idle', Lyn);
  }, function(error) {
    console.error(error);
  })
  buildSheet(Brigand).then(function(ss) {
    createOverworld(ss, 'idle', Brigand);
  }, function(error) {
    console.error(error);
  })
}

function createOverworldSheets() {
  var mugImg = new Image();
  mugImg.src = 'assets/images/mugshots/mugshot-conversation-map-clean.png';
  mugImg.onload = function() {
    fe.mugSheet = mugImg;
    return;
  }
}

function register(c) {
  fe.registry[c.row][c.col].addCharacter(c);
  console.log('Character Added:');
  console.log(fe.registry[c.row][c.col]);
  return;
}

function registerMoveRect(r) {
  fe.registry[r.row][r.col].moveTile = true;
  return;
}

function registerAtkRect(r) {
  fe.registry[r.row][r.col].atkTile = true;
  return;
}

function unregister(c) {
  fe.registry[c.row][c.col].removeCharacter(c);
  return;
}

function unregisterMoveTiles(c) {
  fe.registry[c.row][c.col].moveTile = false;
  fe.registry[c.row][c.col].atkTile = false;
  return;
}

function registry(row, col) {
  try {
    return fe.registry[row][col];
  } catch(e) {
    console.error('Error in function registry');
  }
}

function setBackground(path) {
  fe.bg = new createjs.Bitmap(path);
  _scale(fe.bg);
  fe.main.addChild(fe.bg);
  fe.main.setChildIndex(fe.bg, -1);
}

function buildSheet(character) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.src = character.src;
    img.onload = function() {
      character.images.push(img);
      var ss = new createjs.SpriteSheet(character);
      resolve(ss);
    };
    img.onerror = function(err) {
      reject(Error(err));
    }
  })
}

function buildImage(path, character, action, cb) {
  var img = new Image();
  img.src = path;
  img.onload = function() {
    createSpriteSheet(img, character, action, cb);
  };
}

function createSpriteSheet(img, character, action, cb) {
  character.images.push(img);
  var ss = new createjs.SpriteSheet(character);
  cb(ss, action, character);
}

function createOverworld(ss, action, character) {
  character.sheet = ss;
  character.sprite = new createjs.Sprite(ss, action);
  bindCharacterProps(character.sprite, character);
  character.sprite.index = 2;
  _scale(character.sprite);
  register(character.sprite);
  fe.render(fe.main, character.sprite);

  character.sprite.gotoAndPlay('idle');
  character.sprite.getMoveMatrix(character.sprite.col, character.sprite.row);
} // end createOverworld

function bindCharacterProps(cs, c) {
  cs.getMoveMatrix = function(col, row) {
    var mvData = fe.calculateMove(cs, c);
    fe.registry[mvData[3]][mvData[2]].character.moveMap = [mvData[0], mvData[1]];
  }
  cs.hp = c.hp;
  cs.hpMax = c.hpMax;
  cs.lvl = c.lvl;
  cs.cid = c.wid;
  cs.mv = c.mv;
  cs.col = c.col;
  cs.row = c.row;
  cs.hud = c.hud;
  return;
}

function renderArrow(x, y, rot) {
  var img = new Image();
  //img.src = 'assets/images/overworld/arrow-head.png';
  img.onload = function() {
    var data = {
      images: [img],
      frames: {width: 16, height: 16, count: 1, regX: 0, regY: 0}
    }
    var ss = new createjs.SpriteSheet(data);
    var arrow = new createjs.Sprite(ss);
    _scale(arrow);
    if(!arrowHead.length) {
      arrowHead = arrow;
    }
    if(arrowHead.col === undefined) {
      arrowHead.col = selector.col;
    } else {
      arrow.col = arrowHead.col + x;
    }

    if(arrowHead.row === undefined) {
      arrowHead.row = selector.row;
    } else {
      arrow.row = arrowHead.row + y;
    }
    console.log(arrow);
    arrow.col = selector.col;
    arrow.row = selector.row;
    arrow.index = 3;
    arrow.rotation = rot;
    fe.renderChild(fe.main, arrow);
    fe.render(fe.main);
    arrow.gotoAndPlay(0);
  }
}

export { register, unregister, registerMoveRect, registerAtkRect, unregisterMoveTiles };
