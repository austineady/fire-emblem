import fe from '../Game';
import {_scale} from '../utility';
import Mugshot from './mugshot.js';

function Hud(c) {
  // rgba(182, 209, 255, .7)
  var g = new createjs.Graphics().setStrokeStyle(1).beginStroke('rgba(175, 170, 146, 1.00)').beginFill('rgba(255, 255, 255, .75)').drawRoundRect(0, 0, 100, 36, 2, 2, 2, 2);
  var hudBg = new createjs.Shape(g);
  hudBg.shadow = new createjs.Shadow('rgba(0, 0, 0, .6)', 1, 1, 1);

  var hudHpLabel = new createjs.Text('HP', '700 11px Quicksand, sans-serif', '#fff');
  hudHpLabel.shadow = new createjs.Shadow('#000', 0, 0, 5);
  hudHpLabel.x = 40;
  hudHpLabel.y = 14;

  var hudHp = new createjs.Text(c.hp, '500 10px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)');
  hudHp.x = 60;
  hudHp.y = 15;

  var hudHpMax = new createjs.Text('/ '+c.hpMax, '500 10px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)');
  hudHpMax.x = 73;
  hudHpMax.y = 15;

  var hudHealthContainer = new createjs.Container();
  hudHealthContainer.x = 40;
  hudHealthContainer.y = 28;
  var hudHealthWidth = 54;
  var hudHealthHeight = 4;
  var hudHealthRadius = 2;

  var hudHealthBar = new createjs.Graphics().beginFill('rgba(153, 135, 61, 1.00)').drawRoundRect(0, 0, hudHealthWidth, 4, hudHealthRadius, hudHealthRadius, hudHealthRadius, hudHealthRadius);
  hudHealthBar = new createjs.Shape(hudHealthBar);
  var hudHealth = new createjs.Graphics().beginFill('rgba(225, 204, 104, 1.00)').drawRoundRect(1, 1, hudHealthWidth - 2, hudHealthHeight - 2, hudHealthRadius, hudHealthRadius, hudHealthRadius, hudHealthRadius);
  hudHealth = new createjs.Shape(hudHealth);

  hudHealthContainer.addChild(hudHealthBar);
  hudHealthContainer.setChildIndex(hudHealthBar, 5);
  hudHealthContainer.addChild(hudHealth);
  hudHealthContainer.setChildIndex(hudHealth, 6);

  var hudName = c.hud.nameDisplay !== undefined ? new createjs.Text(c.hud.nameDisplay, '500 10px Quicksand, sans-serif', 'rgba(40, 44, 52, 1.00)') : '';
  hudName.x = c.hud.nameX || 55;
  hudName.y = c.hud.nameY || 2;

  var hudImg = c.hud.mugshot !== undefined ? Mugshot(c.hud.mugshot) : '';
  hudImg.x = c.hud.imgX || 3;
  hudImg.y = c.hud.imgY || 3;
  if(hudImg === '') {
    console.error('Mugshot was invalid. Check the sprite sheet path');
  }

  var hud = new createjs.Container();
  hud.x = fe.pxPerCol / 2;
  hud.y = fe.hudBottom ? fe.pxPerRow * (fe.totalRows - 2) - fe.pxPerRow / 2 : fe.pxPerRow / 2;
  hud.addChild(hudBg);
  hud.addChild(hudImg);
  hud.addChild(hudHpLabel);
  hud.addChild(hudHp);
  hud.addChild(hudHpMax);
  hud.addChild(hudName);
  hud.addChild(hudHealthContainer);
  _scale(hud);

  return hud;
}

fe.displayHud = function(c) {
  fe.hud = new Hud(c);
  fe.render(fe.main, fe.hud);
  fe.hudActive = true;
}

fe.removeHud = function() {
  fe.main.removeChild(fe.hud);
  fe.render(fe.main);
  fe.hudActive = false;
  fe.hud = {};
}

export default Hud;
