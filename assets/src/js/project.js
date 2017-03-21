(function() {
  'use strict';

  // Base Global Obj
  var fe = {};

  window.fe = window.fe || fe;
  fe.characterSelected = false;
  fe.heroSelected = undefined;
  fe.arrowStart = [];
  fe.registry = {};
  // Base Includes
  //=require utility.js
  //=require functions.js
  //=require ui-functions.js
  //=require functions/event-handlers.js
  //=require functions/movement.js
  //=require functions/selector.js


  // Hero Includes
  //=require characters.js

  var main = fe.main = {},
      battle = fe.battle = {},
      hero = fe.hero = {},
      moveCache = fe.moveCache = [],
      metrics = fe.metrics = {},
      selector = fe.selector = {},
      arrowHead = fe.arrowHead = {};

  var totalRows = fe.totalRows = 10,
      totalCols = fe.totalCols = 15,
      canvasWidth = fe.canvasWidth = 240,
      ratio = fe.metrics.ratio = 1.5,
      scale = fe.metrics.scale = 2,
      scaleB = fe.metrics.scaleB = 1.5;

  var xStartB = fe.metrics.xStartB = canvasWidth * scaleB,
      yStartB = fe.metrics.yStartB = xStartB / ratio,
      xStart = fe.metrics.xStart = canvasWidth * scale,
      yStart = fe.metrics.yStart = xStart / ratio,
      pxPerCol = fe.pxPerCol = xStart / totalCols,
      pxPerRow = fe.pxPerRow = yStart / totalRows;

  var mainBg = 'assets/images/background/bg-map-1.png';


  document.onload = createStage();

  function createStage() {
    var me = document.getElementById('main');
    me.width = xStart;
    me.height = yStart;
    main = new createjs.Stage('main');

    setBackground(mainBg);
    createOverworldCharacters();
    createSelector();
    owDebug();
  };

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

  function register(c) {
    var gr = fe.registry;

    gr[c.col + ', ' + c.row] = c;
  }

  function setBackground(path) {
    var bitmap = new createjs.Bitmap(path);
    _scale(bitmap);
    main.addChild(bitmap);
    main.setChildIndex(bitmap, -1);
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
    character.sprite.cid = character.wid;
    character.sprite.mv = character.mv;
    character.sprite.builder = character.builder;
    character.sprite.col = character.col;
    character.sprite.row = character.row;
    character.sprite.index = 2;
    _scale(character.sprite);
    character.sprite.addEventListener('click', function(e) {
      if(moveCache.length === 0) {
        handleStageClick(character, e);
      }
    });
    register(character.sprite);
    console.log(character.sprite);
    fe.render(main, character.sprite);

    if(moveCache.length !== 0) {
      drawMoveRects(moveCache);
    }
    if(action !== 0) {
      character.sprite.gotoAndPlay('idle');
      window.setInterval(function() {
        fe.render(main);
      }, 1000);
    }
  } // end createOverworld

  function renderArrow(x, y, rot) {
    var img = new Image();
    img.src = 'assets/images/overworld/arrow-head.png';
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
})();
