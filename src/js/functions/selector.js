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
      frames: {width: 24, height: 24, count: 2, regX: 0, regY: 0}
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
  };
}

function bindSelector() {
  fe.bg.addEventListener('click', handleStageClick);
  document.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
      case 38:
        // Arrow Up
        if(fe.selector.row - 1 >= 0) {
          fe.selector.row -= 1;
        } else {
          fe.selector.row = fe.selector.row;
        }
        var arrowY = fe.selector.row;
        var arrowX = fe.selector.col;
        fe.render(fe.main, fe.selector);
        //renderArrow(arrowX, arrowY, 0);
        break;
      case 39:
        // Arrow Right
        if(fe.selector.col + 1 <= fe.totalCols - 1) {
          fe.selector.col += 1;
        } else {
          fe.selector.col = fe.selector.col;
        }
        var arrowY = fe.selector.row;
        var arrowX = fe.selector.col;
        fe.render(fe.main, fe.selector);
        //renderArrow(arrowX, arrowY, 90);
        break;
      case 40:
        // Arrow Down
        if(fe.selector.row + 1 <= fe.totalRows - 1) {
          fe.selector.row += 1;
        } else {
          fe.selector.row = fe.selector.row;
        }
        var arrowY = fe.selector.row;
        var arrowX = fe.selector.col;
        fe.render(fe.main, fe.selector);
        //renderArrow(arrowX, arrowY, 180);
        break;
      case 37:
        // Arrow Left
        fe.selector.row = fe.selector.row;
        if(fe.selector.col - 1 >= 0) {
          fe.selector.col -= 1;
        } else {
          fe.selector.col = fe.selector.col;
        }
        var arrowY = fe.selector.row;
        var arrowX = fe.selector.col;
        fe.render(fe.main, fe.selector);
        //renderArrow(arrowX, arrowY, 270);
        break;
      case 32:
        // Spacebar
        if(fe.registry[fe.selector.row][fe.selector.col].character !== null && !fe.characterSelected) {
          fe.heroSelected = fe.registry[fe.selector.row][fe.selector.col].character;
          console.log("Hero Selected: ");
          console.log(fe.heroSelected);
          fe.drawMoveRects(fe.heroSelected.moveMap[0], fe.heroSelected);
          fe.drawAtkRects(fe.heroSelected.moveMap[1], fe.heroSelected);
          fe.characterSelected = true;
        } else if(fe.characterSelected && fe.hoverSelect === fe.heroSelected) {
          fe.removeMoveMap();
          fe.resetStage();
        } else if(fe.characterSelected && fe.heroSelected !== undefined) {
          console.log("Space Bar Pressed");
          fe.calculateMoveSelect();
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

export { createSelector, bindSelector, handleStageClick };
