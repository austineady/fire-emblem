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

  // Hero Includes
  //=require characters.js

  var main = fe.main = {},
      battle = fe.battle = {},
      hero = fe.hero = {},
      moveCache = fe.moveCache = [],
      metrics = fe.metrics = {},
      selector = fe.selector = {};

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

  function createOverworld(ss, action, data) {
    var owChar = new createjs.Sprite(ss, action);
    _scale(owChar);
    if(data.col !== undefined && data.row !== undefined) {
      owChar.col = data.col;
      owChar.row = data.row;
    }
    owChar.index = 2;
    owChar.addEventListener('click', function(e) {
      if(moveCache.length === 0) {
        handleStageClick(owChar, e);
      }
    });
    console.log(owChar);
    fe.render(main, owChar);

    if(moveCache.length !== 0) {
      drawMoveRects(moveCache);
    }
    if(action !== 0) {
      owChar.gotoAndPlay('idle');
      window.setInterval(function() {
        fe.render(main);
      }, 1000);
    }
  } // end createOverworld

  function createSelector() {
    var cw = main.canvas.clientWidth;
    var ch = main.canvas.clientHeight;
    var img = new Image();
    img.src = 'assets/images/overworld/overworld-select.png';
    img.onload = function() {
      var data = {
        row: 9,
        col: 14,
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
            if(selector.row - 1 >= 0) {
              selector.row = selector.row - 1;
            } else {
              selector.row = selector.row;
            }
            fe.render(main, selector);
            renderArrow(selector.col, selector.row, 0);
            break;
          case 39:
            // Arrow Right
            if(selector.col + 1 <= totalCols) {
              selector.col = selector.col + 1;
            } else {
              selector.col = selector.col;
            }
            fe.render(main, selector);
            renderArrow(selector.col, selector.row, 90);
            break;
          case 40:
            // Arrow Down
            if(selector.row + 1 <= totalRows) {
              selector.row = selector.row + 1;
            } else {
              selector.row = selector.row;
            }
            fe.render(main, selector);
            renderArrow(selector.col, selector.row, 180);
            break;
          case 37:
            // Arrow Left
            if(selector.col - 1 >= 0) {
              selector.col = selector.col - 1;
            } else {
              selector.col = selector.col;
            }
            fe.render(main, selector);
            renderArrow(selector.col, selector.row, -90);
            break;
          case 32:
            // Spacebar
            if(lyn.row === selector.row && lyn.col === selector.col && moveCache.length === 0) {
              fe.characterSelected = true;
              createMoveMap(5, lyn.col, lyn.row, lyn);
            }
            break;
        }
      })
      _scale(selector, scaleB);
      fe.render(main, selector);
      selector.gotoAndPlay(0);
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
