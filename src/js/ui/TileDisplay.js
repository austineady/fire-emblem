import fe from '../Game';
import { _scale } from '../utility';

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

export default createTileDisplay;
