var mvWorker = require('worker-loader!./workers/move-worker.js');
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


fe.main = new createjs.Stage('main');
fe.battle = {};
fe.selector = {};
fe.hero = {};
fe.bg = {};
fe.metrics = {};
fe.selector = {};
fe.arrowHead = {};
fe.totalRows = 10;
fe.totalCols = 15;
fe.canvasWidth = 240;
fe.ratio = 1.5;
fe.scale = window.innerWidth <= 500 ? window.innerWidth / fe.canvasWidth : 500 / fe.canvasWidth;
fe.scaleB = 1.5;

fe.xStartB = fe.canvasWidth * fe.scaleB;
fe.yStartB = fe.xStartB / fe.ratio;
fe.xStart = fe.canvasWidth * fe.scale;
fe.yStart = fe.xStart / fe.ratio;
fe.pxPerCol = fe.xStart / fe.totalCols;
fe.pxPerRow = fe.yStart / fe.totalRows;

fe.worker = new mvWorker();

var Mugshot = undefined;

fe.render = function(stage, child) {
  if(child) {
    if(child.col !== undefined && child.row !== undefined) {
      child.x = fe.pxPerCol * child.col;
      child.y = fe.pxPerRow * child.row;
    }
    if(child.index !== undefined) {
      stage.setChildIndex(child, 2);
    }

    stage.addChild(child);
  }
  stage.update();
  return;
}

fe.update = function(stage, child) {
  child.x = fe.pxPerCol * child.col;
  child.y = fe.pxPerRow * child.row;

  stage.update();
  return;
}

fe.renderChild = function(container, child) {
  if(child.col !== undefined && child.row !== undefined) {
    child.x = fe.pxPerCol * child.col - 1;
    child.y = fe.pxPerRow * child.row - 1;
  }
  if(child.index !== undefined) {
    container.setChildIndex(child, 2);
  }

  container.addChild(child);
  return;
}

export default fe;
