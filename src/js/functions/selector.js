import { _scale, rowsToPixels, pixelsToCols, colsToPixels, pixelsToRows, isEmpty } from '../utility';
import fe from '../Game';
import Hud from './hud.js';

fe.createSelector = function() {
  var img = new Image();
  img.src = 'assets/images/overworld/overworld-select.png';
  img.onload = function() {
    var data = {
      row: 8,
      col: 13,
      images: [img],
      frames: [
        [0, 0, 24, 24],
        [24, 0, 24, 24],
        [24, 0, 24, 24],
        [0, 0, 24, 24]
      ]
    }
    var ss = new createjs.SpriteSheet(data);
    fe.selector = new createjs.Sprite(ss);
    fe.selector.row = data.row;
    fe.selector.col = data.col;
    _scale(fe.selector, fe.scaleB);
    fe.render(fe.main, fe.selector);
    fe.selector.gotoAndPlay(0);
    fe.arrowStart = [fe.selector.x, fe.selector.y];
    bindSelector();
    createTileDisplay();
  };
}

function bindSelector() {
  fe.bg.addEventListener('click', handleStageClick);
  document.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
      case 38:
        // Arrow Up
        if(!fe.userMenuActive) {
          if(fe.selector.row - 1 >= 0) {
            fe.selector.row -= 1;
          } else {
            fe.selector.row = fe.selector.row;
          }
          var arrowY = fe.selector.row;
          var arrowX = fe.selector.col;
          fe.render(fe.main, fe.selector);
        } else {
          var index = fe.userMenu.selectorIndex - 1 >= 1 ? fe.userMenu.selectorIndex - 1 : fe.userMenu.selectorIndex;
          fe.userMenu.update(index);
        }
        //renderArrow(arrowX, arrowY, 0);
        break;
      case 39:
        // Arrow Right
        if(!fe.userMenuActive) {
          if(fe.selector.col + 1 <= fe.totalCols - 1) {
            fe.selector.col += 1;
          } else {
            fe.selector.col = fe.selector.col;
          }
          var arrowY = fe.selector.row;
          var arrowX = fe.selector.col;
          fe.render(fe.main, fe.selector);
        }
        //renderArrow(arrowX, arrowY, 90);
        break;
      case 40:
        // Arrow Down
        if(!fe.userMenuActive) {
          if(fe.selector.row + 1 <= fe.totalRows - 1) {
            fe.selector.row += 1;
          } else {
            fe.selector.row = fe.selector.row;
          }
          var arrowY = fe.selector.row;
          var arrowX = fe.selector.col;
          fe.render(fe.main, fe.selector);
        } else {
          var index = fe.userMenu.selectorIndex + 1 <= fe.userMenu.optsLength ? fe.userMenu.selectorIndex + 1 : fe.userMenu.selectorIndex;
          fe.userMenu.update(index);
        }
        //renderArrow(arrowX, arrowY, 180);
        break;
      case 37:
        // Arrow Left
        if(!fe.userMenuActive) {
          fe.selector.row = fe.selector.row;
          if(fe.selector.col - 1 >= 0) {
            fe.selector.col -= 1;
          } else {
            fe.selector.col = fe.selector.col;
          }
          var arrowY = fe.selector.row;
          var arrowX = fe.selector.col;
          fe.render(fe.main, fe.selector);
        }
        //renderArrow(arrowX, arrowY, 270);
        break;
      case 32:
        // Spacebar
        if(!fe.userMenuActive) {
          if(fe.registry[fe.selector.row][fe.selector.col].character !== null && !fe.characterSelected) {
            // Character has been selected, change overworld animation
            fe.heroSelected = fe.registry[fe.selector.row][fe.selector.col].character;
            console.log("Hero Selected: ");
            console.log(fe.heroSelected);
            fe.drawMoveRects(fe.heroSelected.moveMap[0], fe.heroSelected);
            fe.drawAtkRects(fe.heroSelected.moveMap[1], fe.heroSelected);
            fe.characterSelected = true;
          } else if(fe.characterSelected && fe.hoverSelect === fe.heroSelected) {
            // Same character has been deselected
            fe.removeMoveMap();
            fe.resetStage();
          } else if(fe.characterSelected && fe.heroSelected !== undefined) {
            // Calculate Character Move
            fe.calculateMoveSelect();
          }
        }
        break;
    }
    fe.handleSelector();
    _scale(fe.selector, fe.scaleB);
    fe.render(fe.main, fe.selector);
    fe.selector.gotoAndPlay(0);
  })
}

function handleStageClick(e) {
  fe.selector.col = pixelsToCols(e.stageX);
  fe.selector.row = pixelsToRows(e.stageY);
  fe.update(fe.main, fe.selector);
  fe.handleSelector();
}

fe.handleSelector = function() {
  fe.tileDisplay.update(fe.registry[fe.selector.row][fe.selector.col]);
  console.log('handleSelector');
  if(fe.selector.row < (fe.totalRows - 1) / 2 && !fe.hudBottom) {
    fe.hudBottom = true;
  } else if(fe.selector.row >= (fe.totalRows - 1) / 2 && fe.hudBottom) {
    fe.hudBottom = false;
  }
  if(fe.registry[fe.selector.row][fe.selector.col].character !== null) {
    fe.hoverSelect = fe.registry[fe.selector.row][fe.selector.col].character;
    console.log("Select Hover Event:");
    console.log(fe.hoverSelect);
    if(fe.hoverSelect && fe.hoverSelect.hud) {
      console.log("Hud Activated");
      if(!fe.hudActive) {
        fe.displayHud(fe.hoverSelect);
      }
    }
  } else {
    fe.hoverSelect = undefined;
    if(fe.hudActive) {
      console.log("Hud Deactivated");
      fe.removeHud();
    }
  }
  return;
}

function createTileDisplay() {
  fe.tileDisplay = new createjs.Container();
  fe.tileDisplay.x = fe.main.canvas.clientWidth - (36 * fe.scale) - fe.pxPerCol / 2;
  fe.tileDisplay.y = fe.hudBottom ? fe.pxPerRow * (fe.totalRows - 2) - fe.pxPerRow / 2 : fe.pxPerRow / 2;

  var displayTop = new createjs.Shape(new createjs.Graphics().setStrokeStyle(1).beginStroke('rgba(247, 246, 183, 1.00)').beginFill('rgba(89, 91, 189, .9)').drawRect(0, 0, 36, 36));

  var displayBottom = new createjs.Shape(new createjs.Graphics().beginFill('rgba(247, 246, 183, 1.00)').drawRect(0, 18, 36, 18));

  var tileName = new createjs.Text('Type', '500 10px Quicksand, sans-serif', '#fff');
  tileName.shadow = new createjs.Shadow('#000', 0, 0, 5);
  tileName.x = 3;
  tileName.y = 2;

  var tileDefLabel = new createjs.Text('DEF', '500 8px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)');
  tileDefLabel.x = 2;
  tileDefLabel.y = 18;
  var tileDef = new createjs.Text('--', '500 8px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)');
  tileDef.x = 30;
  tileDef.y = 18;

  var tileAvoidLabel = new createjs.Text('AVO', '500 8px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)');
  tileAvoidLabel.x = 2;
  tileAvoidLabel.y = 26;
  var tileAvoid = new createjs.Text('--', '500 8px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)');
  tileAvoid.x = 24;
  tileAvoid.y = 26;

  fe.tileDisplay.addChild(displayTop);
  fe.tileDisplay.addChild(displayBottom);
  fe.tileDisplay.addChild(tileDefLabel);
  fe.tileDisplay.addChild(tileAvoidLabel);
  fe.tileDisplay.addChild(tileName);
  fe.tileDisplay.addChild(tileDef);
  fe.tileDisplay.addChild(tileAvoid);
  _scale(fe.tileDisplay);

  fe.render(fe.main, fe.tileDisplay);

  fe.tileDisplay.update = function(tile) {
    tileName.text = tile.type;
    tileDef.text = tile.def;
    tileDef.x = tile.def === '--' ? tileDef.x = 28 : tileDef.x = 30;
    tileAvoid.text = tile.avo;
    tileAvoid.x = tile.avo === '--' ? tileAvoid.x = 28 : tileAvoid.x = 24;
    fe.render(fe.main);
  }

  if(fe.selector !== undefined) {
    fe.tileDisplay.update(fe.registry[fe.selector.row][fe.selector.col]);
  }
}

export { createSelector, bindSelector, handleStageClick };
