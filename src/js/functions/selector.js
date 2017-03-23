import { _scale, rowsToPixels, pixelsToCols, colsToPixels, pixelsToRows, isEmpty } from '../utility';
import { scaleB, totalRows, totalCols, main, bg } from '../project';
var selector = {};

function createSelector() {
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
  bg.addEventListener('click', handleStageClick);
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
        if(fe.registry[selector.row][selector.col] !== undefined && !fe.characterSelected) {
          fe.heroSelected = fe.registry[selector.row][selector.col];
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
    handleSelector();
    _scale(selector, scaleB);
    fe.render(main, selector);
    selector.gotoAndPlay(0);
  })
}

function handleStageClick(e) {
  selector.col = pixelsToCols(e.stageX);
  selector.row = pixelsToRows(e.stageY);
  fe.update(main, selector);
  handleSelector();
}

function handleSelector() {
  if(selector.row < totalRows / 2 && !fe.hudBottom) {
    fe.hudBottom = true;
  } else if(selector.row >= totalRows / 2 && fe.hudBottom) {
    fe.hudBottom = false;
  }
  if(fe.registry[selector.row][selector.col] !== undefined) {
    fe.hoverSelect = fe.registry[selector.row][selector.col];
    console.log("Select Hover Event:");
    console.log(fe.hoverSelect);
    if(fe.hoverSelect.hud) {
      console.log("Hud Activated");
      if(!fe.hudActive) {
        displayHud(fe.hoverSelect);
      }
    }
  } else {
    fe.hoverSelect = undefined;
    if(fe.hudActive) {
      console.log("Hud Deactivated");
      removeHud();
    }
  }
  return;
}

export { createSelector, bindSelector, handleSelector, handleStageClick, selector };
