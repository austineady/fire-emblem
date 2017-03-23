require('../scss/project.scss');

// Base Global Obj
var fe = {};
window.fe = window.fe || fe;

fe.characterSelected = false;
fe.hudActive = false;
fe.hudBottom = false;
fe.selectorMoving = false;

fe.heroSelected = undefined;
fe.hud = undefined;
fe.int = undefined;
fe.registry = [];
fe.tMap = [];

var mvWorker = new Worker('src/js/workers/move-worker.js');

var main = fe.main = {},
    battle = fe.battle = {},
    hero = fe.hero = {},
    bg = fe.bg = {},
    metrics = fe.metrics = {},
    selector = fe.selector = {},
    arrowHead = fe.arrowHead = {},
    Mugshot = undefined;

var totalRows = fe.totalRows = 10,
    totalCols = fe.totalCols = 15,
    canvasWidth = fe.canvasWidth = 240,
    ratio = fe.metrics.ratio = 1.5,
    scale = fe.metrics.scale = window.innerWidth <= 500 ? window.innerWidth / canvasWidth : 500 / canvasWidth,
    scaleB = fe.metrics.scaleB = 1.5;

var xStartB = fe.metrics.xStartB = canvasWidth * scaleB,
    yStartB = fe.metrics.yStartB = xStartB / ratio,
    xStart = fe.metrics.xStart = canvasWidth * scale,
    yStart = fe.metrics.yStart = xStart / ratio,
    pxPerCol = fe.pxPerCol = xStart / totalCols,
    pxPerRow = fe.pxPerRow = yStart / totalRows;

import { _scale, rowsToPixels, pixelsToCols, colsToPixels, pixelsToRows, isEmpty, render, update, renderChild } from './utility';
fe.render = render;
fe.update = update;
fe.renderChild = renderChild;
import { createSelector, bindSelector, handleSelector, handleStageClick } from './functions/selector.js';
import * as game from './game';
import * as ui from './ui-functions';
import lyn from './heroes/lyn.js';
import brigand from './enemies/brigand.js';
import terrainMap from './maps/terrain.js';
import * as movement from './functions/movement.js';
import * as hud from './functions/hud.js';
import maps from './maps/level-0.js';

document.onload = createStage();

function createStage() {
  var me = document.getElementById('main');
  me.width = xStart;
  me.height = yStart;
  main = new createjs.Stage('main');
  createTiles(maps.level0.terrain);
  setBackground(maps.level0.background);
  createOverworldCharacters();
  createOverworldSheets();
  createSelector();
  owDebug();
  window.setTimeout(handleSelector, 100);
  createjs.Ticker.addEventListener("tick", function (event) {
      // Actions carried out each tick (aka frame)
      fe.render(main);
      if (!event.paused) {
          // Actions carried out when the Ticker is not paused.
      }
  });
  createjs.Ticker.framerate = 4;
};

function Tile(col, row, key) {
  var obj = terrainMap[key];
  this.col = col;
  this.row = row;
  this.tid = obj.tid;
  this.type = obj.type;
  this.avo = obj.avo;
  this.def = obj.def;
  this.regen = obj.regen;
  this.collide = obj.collide;
  this.character = null;
  this.canMoveTo = false;
  this.canAttack = false;
  this.addCharacter = function(c) {
    if(this.character === null) {
      this.character = c;
    } else {
      console.error('There is already a character in that tile');
    }
  }
  this.removeCharacter = function() {
    this.character = {};
  }
  this.requestMove = function(c) {
    var self = this;
    if(!this.collide && this.canMoveTo && !this.canAttack && this.character === null) {
      this.character = c;
      this.canMoveTo = false;
      return true;
    } else {
      return false;
    }
  }
}

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

function owDebug(x, y, col, row) {
  var paramList = [x, y, col, row];
  var idList = ['selector-x', 'selector-y', 'selector-col', 'selector-row'];
  for(var i=0;i<idList.length;i++) {
    var el = document.getElementById(idList[i]);
    el.textContent = paramList[i];
  }
}

function createOverworldCharacters() {
  buildSheet(lyn).then(function(ss) {
    createOverworld(ss, 'idle', lyn);
  }, function(error) {
    console.error(error);
  })
  buildSheet(brigand).then(function(ss) {
    createOverworld(ss, 'idle', brigand);
  }, function(error) {
    console.error(error);
  })
}

function createOverworldSheets() {
  var mugImg = new Image();
  mugImg.src = 'assets/images/mugshots/mugshot-conversation-map-clean.png';
  mugImg.onload = function() {
    Mugshot = function(frames) {
      var mugSS = new createjs.SpriteSheet({
        images: new Array(mugImg),
        frames: [
          frames
        ]
      });
      var mugSprite = new createjs.Sprite(mugSS);
      return mugSprite;
    };
    return;
  }
}

function register(c) {
  fe.registry[c.row][c.col].addCharacter(c);
  console.log('Character Added:');
  console.log(fe.registry[c.row][c.col]);
  return;
}

function unregister(c) {
  fe.registry[c.row][c.col].removeCharacter(c);
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
  bg = new createjs.Bitmap(path);
  _scale(bg);
  main.addChild(bg);
  main.setChildIndex(bg, -1);
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
  fe.render(main, character.sprite);

  character.sprite.gotoAndPlay('idle');
  character.sprite.getMoveMatrix(character.sprite.col, character.sprite.row);
} // end createOverworld

function bindCharacterProps(cs, c) {
  cs.getMoveMatrix = function(col, row) {
    mvWorker.postMessage({
      'tMap': fe.tMap,
      'canvasHeight': main.canvas.clientHeight,
      'canvasWidth': main.canvas.clientWidth,
      'totalCols': totalCols,
      'totalRows': totalRows,
      'mv': c.mv,
      'col': col,
      'row': row,
      'atk': 1
    });

    mvWorker.onmessage = function(e) {
      fe.registry[e.data[3]][e.data[2]].character.moveMap = [e.data[0], e.data[1]];
      console.log('Move Map Added: ');
      console.log(fe.registry[e.data[3]][e.data[2]]);
    }
  }
  cs.hp = c.hp;
  cs.hpMax = c.hpMax;
  cs.lvl = c.lvl;
  cs.cid = c.wid;
  cs.mv = c.mv;
  cs.builder = c.builder;
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
    fe.renderChild(main, arrow);
    fe.render(main);
    arrow.gotoAndPlay(0);
  }
}

export { bg, mainBg, main, scale, scaleB, xStart, yStart, totalRows, totalCols };
