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
    selector = new createjs.Sprite(ss);
    selector.row = data.row;
    selector.col = data.col;
    _scale(selector, scaleB);
    fe.render(main, selector);
    selector.gotoAndPlay(0);
    fe.arrowStart = [selector.x, selector.y];
    bindSelector();
  };
}

function bindSelector() {
  document.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
      case 38:
        // Arrow Up
        if(selector.row - 1 >= 0) {
          selector.row -= 1;
        } else {
          selector.row = selector.row;
        }
        var arrowY = selector.row;
        var arrowX = selector.col;
        fe.render(main, selector);
        //renderArrow(arrowX, arrowY, 0);
        break;
      case 39:
        // Arrow Right
        if(selector.col + 1 <= totalCols) {
          selector.col += 1;
        } else {
          selector.col = selector.col;
        }
        var arrowY = selector.row;
        var arrowX = selector.col;
        fe.render(main, selector);
        //renderArrow(arrowX, arrowY, 90);
        break;
      case 40:
        // Arrow Down
        if(selector.row + 1 <= totalRows) {
          selector.row += 1;
        } else {
          selector.row = selector.row;
        }
        var arrowY = selector.row;
        var arrowX = selector.col;
        fe.render(main, selector);
        //renderArrow(arrowX, arrowY, 180);
        break;
      case 37:
        // Arrow Left
        selector.row = selector.row;
        if(selector.col - 1 >= 0) {
          selector.col -= 1;
        } else {
          selector.col = selector.col;
        }
        var arrowY = selector.row;
        var arrowX = selector.col;
        fe.render(main, selector);
        //renderArrow(arrowX, arrowY, 270);
        break;
      case 32:
        // Spacebar
        if(fe.registry[selector.col + ', ' + selector.row] !== undefined && !fe.characterSelected) {
          fe.heroSelected = fe.registry[selector.col + ', ' + selector.row];
          console.log("Hero Selected: ");
          console.log(fe.heroSelected);
          drawMoveRects(fe.heroSelected.moveMap[0], fe.heroSelected);
          drawAtkRects(fe.heroSelected.moveMap[1], fe.heroSelected);
          fe.characterSelected = true;
        } else if(fe.characterSelected && fe.hoverSelect === fe.heroSelected) {
          removeMoveMap();
        } else if(fe.characterSelected && fe.heroSelected !== undefined) {
          console.log("Space Bar Pressed");
          calculateMoveSelect();
        }
        break;
    }
    if(fe.registry[selector.col + ', ' + selector.row] !== undefined) {
      fe.hoverSelect = fe.registry[selector.col + ', ' + selector.row];
      console.log("Select Hover Event:");
      console.log(fe.hoverSelect);
      if(fe.hoverSelect.hud) {
        displayHud(fe.hoverSelect);
      }
    } else {
      fe.hoverSelect = undefined;
    }
    _scale(selector, scaleB);
    fe.render(main, selector);
    selector.gotoAndPlay(0);
  })
}

function displayHud(c) {
  var hud = new createjs.Container();
  var name = new createjs.Text(c.hud.nameDisplay, '400 20px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)');
  var g = new createjs.Graphics().setStrokeStyle(2).beginStroke('rgba(225, 239, 238, 1.00)').beginFill('rgba(171, 193, 223, .9)').drawRoundRect(0, 0, 100, 34, 5, 5, 5, 5);
  var hudBg = new createjs.Shape(g);
  _scale(hudBg);
  var hudImg = Mugshot(c.hud.mugshot);
  console.log(hudImg);
  hudImg.x = 4;
  hudImg.y = 2;
  hud.x = pxPerCol / 2;
  hud.y = pxPerRow / 2;
  name.x = pxPerCol * 2.5;
  name.y = 10;
  hud.addChild(hudBg);
  hud.addChild(hudImg);
  hud.addChild(name);
  fe.render(main, hud);
}
