import { _scale, rowsToPixels, pixelsToCols, colsToPixels, pixelsToRows, isEmpty } from '../utility';
import fe from '../Game';
import Hud from './hud.js';
import createTileDisplay from '../ui/TileDisplay.js';

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
    createTileDisplay();
  };
}

function handleStageClick(e) {
  fe.selector.col = pixelsToCols(e.stageX);
  fe.selector.row = pixelsToRows(e.stageY);
  fe.update(fe.main, fe.selector);
  fe.handleSelector();
}

fe.handleSelector = function() {
  fe.tileDisplay.update(fe.registry[fe.selector.row][fe.selector.col]);
  if(fe.selector.row < (fe.totalRows - 1) / 2 && !fe.hudBottom) {
    fe.hudBottom = true;
  } else if(fe.selector.row >= (fe.totalRows - 1) / 2 && fe.hudBottom) {
    fe.hudBottom = false;
  }
  if(fe.registry[fe.selector.row][fe.selector.col].character !== null) {
    fe.hoverSelect = fe.registry[fe.selector.row][fe.selector.col].character;
    console.log("Character Hover Event:");
    console.log(fe.hoverSelect);
    if(fe.hoverSelect && fe.hoverSelect.hud) {
      console.log("Hud Activated");
      if(fe.hudActive) {
        fe.removeHud();
      }
      fe.displayHud(fe.hoverSelect);
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

export { createSelector, handleStageClick };
