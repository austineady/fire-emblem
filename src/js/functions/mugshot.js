import fe from '../Game';

var Mugshot = function(frames) {
  var mugSS = new createjs.SpriteSheet({
    images: new Array(fe.mugSheet),
    frames: [
      frames
    ]
  });
  var mugSprite = new createjs.Sprite(mugSS);
  return mugSprite;
};

export default Mugshot;
