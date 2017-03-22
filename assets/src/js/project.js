(function() {
  'use strict';

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
  fe.registry = {};
  fe.tMap = [];

  var mvWorker = new Worker('assets/src/js/workers/move-worker.js');
  // Base Includes
  //=require utility.js
  //=require functions.js
  //=require ui-functions.js
  //=require functions/event-handlers.js
  //=require functions/movement.js
  //=require functions/selector.js
  //=require functions/hud.js
  //=require maps/level-0.js


  // Hero Includes
  //=require characters.js

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
      console.log("Mugshot Constructor Ready");
      return;
    }
  }

  function register(c) {
    fe.registry[c.col + ', ' + c.row] = c;
    console.log(fe.registry);
    return;
  }

  function unregister(c) {
    delete fe.registry[c.col + ', ' + c.row];
    return;
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
        console.log(fe.registry);
        fe.registry[e.data[2] + ', ' + e.data[3]].moveMap = [e.data[0], e.data[1]];
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
