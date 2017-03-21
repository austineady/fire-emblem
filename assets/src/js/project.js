(function() {
  'use strict';

  // Base Global Obj
  var fe = {};

  window.fe = window.fe || fe;
  fe.characterSelected = false;
  fe.arrowStart = [];
  // Base Includes
  //=require utility.js
  //=require functions.js
  //=require ui-functions.js
  //=require functions/event-handlers.js
  //=require functions/movement.js

  // Hero Includes
  //=require heroes/lyn.js
  //=require enemies/brigand.js

  // var tanaPath = 'sprites/tana_pegasus_knight_lance_long.png';

  var main = fe.main = {},
      battle = fe.battle = {},
      hero = fe.hero = {},
      moveCache = fe.moveCache = [],
      metrics = fe.metrics = {},
      selector = fe.selector = {};

  var ratio = fe.metrics.ratio = 1.5,
      scale = fe.metrics.scale = 2,
      scaleB = fe.metrics.scaleB = 1.5,
      xStartB = fe.metrics.xStartB = 240 * scaleB,
      yStartB = fe.metrics.yStartB = xStartB / ratio,
      xStart = fe.metrics.xStart = 240 * scale,
      yStart = fe.metrics.yStart = xStart / ratio,
      pxPerCol = fe.pxPerCol = xStart / 15,
      pxPerRow = fe.pxPerRow = yStart / 10,
      brigand = new Brigand(),
      lyn = new Lyn();

  document.onload = createStage();

  function createStage() {
    var mainBg = 'assets/images/background/bg-map-1.png';
    var me = document.getElementById('main');
    me.width = xStart;
    me.height = yStart;
    main = new createjs.Stage('main');

    setBackground(mainBg);
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
    createSelector();
    createBattleStage();
  };

  function createBattleStage() {
    var be = document.getElementById('battle');
    be.width = xStartB;
    be.height = yStartB;
    battle = new createjs.Stage('battle');

    buildImage(lyn.battle.src, lyn.battle, 'start', createSpriteAnimation);
    buildImage(brigand.ss, brigand.battle, 'attack', createSpriteAnimation);
  }

  function setBackground(path) {
    var bitmap = new createjs.Bitmap(path);
    _scale(bitmap);
    main.addChild(bitmap);
    main.setChildIndex(bitmap, -1);
  }

  function buildSheet(data) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.src = data.src;
      img.onload = function() {
        data.images.push(img);
        var ss = new createjs.SpriteSheet(data);
        resolve(ss);
      };
      img.onerror = function(err) {
        reject(Error(err));
      }
    })
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
    battle.addChild(sprite);
    renderDisplay(sprite);

    sprite.gotoAndStop(0);
  }

  function createOverworld(ss, action, data) {
    var owChar = new createjs.Sprite(ss, action);
    _scale(owChar);
    if(data.col !== undefined && data.row !== undefined) {
      owChar.x = colsToPixels(data.col - 1);
      owChar.y = rowsToPixels(data.row - 1);
    }
    owChar.addEventListener('click', function(e) {
      if(moveCache.length === 0) {
        handleStageClick(owChar, e);
      }
    });
    console.log(owChar);
    main.addChild(owChar);
    main.setChildIndex(owChar, 2);
    fe.render(main);
    if(moveCache.length !== 0) {
      drawMoveRects(moveCache);
    }
    if(action !== 0) {
      owChar.gotoAndPlay('idle');
      window.setInterval(function() {
        fe.render(main);
      }, 1000);
    }
  }

  function createSelector() {
    var cw = main.canvas.clientWidth;
    var ch = main.canvas.clientHeight;
    var img = new Image();
    img.src = 'assets/images/overworld/overworld-select.png';
    img.onload = function() {
      var data = {
        row: 8,
        col: 13,
        images: [img],
        frames: {width: 24, height: 24, count: 2, regX: 0, regY: 0}
      }
      var ss = new createjs.SpriteSheet(data);
      var selector = new createjs.Sprite(ss);
      selector.row = data.row;
      selector.col = data.col;
      document.addEventListener('keydown', function(e) {
        switch(e.keyCode) {
          case 38:
            // Arrow Up
            if(rowsToPixels(selector.row - 1) >= 0) {
              selector.row = selector.row - 1;
            } else {
              selector.row = selector.row;
            }
            selector.y = rowsToPixels(selector.row);
            fe.render(main);
            renderArrow(selector.col, selector.row, 0);
            break;
          case 39:
            // Arrow Right
            if(colsToPixels(selector.col + 1) <= colsToPixels(14)) {
              selector.col = selector.col + 1;
            } else {
              selector.col = selector.col;
            }
            selector.x = colsToPixels(selector.col);
            fe.render(main);
            renderArrow(selector.col, selector.row, 90);
            break;
          case 40:
            // Arrow Down
            if(rowsToPixels(selector.row + 1) <= rowsToPixels(9)) {
              selector.row = selector.row + 1;
            } else {
              selector.row = selector.row;
            }
            selector.x = colsToPixels(selector.col);
            fe.render(main);
            renderArrow(selector.col, selector.row, 180);
            break;
          case 37:
            // Arrow Left
            if(colsToPixels(selector.col - 1) >= 0) {
              selector.col = selector.col - 1;
            } else {
              selector.col = selector.col;
            }
            selector.x = colsToPixels(selector.col);
            fe.render(main);
            renderArrow(selector.col, selector.row, -90);
            break;
          case 32:
            // Spacebar
            if(lyn.row === selector.row + 1 && lyn.col === selector.col + 1 && moveCache.length === 0) {
              fe.characterSelected = true;
              createMoveMap(5, lyn.col - 1, lyn.row - 1, lyn);
            }
            break;
        }
      })
      main.addChild(selector);
      _scale(selector, scaleB);
      fe.render(main);
      selector.gotoAndPlay(0);
      selector.x = colsToPixels(selector.col);
      selector.y = rowsToPixels(selector.row);
      fe.arrowStart = [selector.x, selector.y];
    };
  }

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
      fe.moveContainer.addChild(arrow);
      arrow.x = colsToPixels(x);
      arrow.y = rowsToPixels(y);
      arrow.rotation = rot;
      fe.render(main);
      arrow.gotoAndPlay(0);
    }
  }
})();
