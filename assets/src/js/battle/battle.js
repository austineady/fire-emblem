// Needed Variables
var brigand = new Brigand(),
    lyn = new Lyn();

function createBattleCharacters() {

  createBattleStage();
}

function createBattleStage() {
  var be = document.getElementById('battle');
  be.width = xStartB;
  be.height = yStartB;
  battle = new createjs.Stage('battle');

  buildImage(lyn.battle.src, lyn.battle, 'start', createSpriteAnimation);
  buildImage(brigand.ss, brigand.battle, 'attack', createSpriteAnimation);
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
