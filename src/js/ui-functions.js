function playSprite() {
  lyn.gotoAndPlay('start');
  createjs.Ticker.addEventListener("tick", function() {
    renderDisplay(lyn);
  });
}

function playSprite2() {
  if(brigand.currentFrame === 0) {
    brigand.gotoAndPlay('attack');
  } else {
    brigand.gotoAndPlay(brigand.currentFrame);
  }
  createjs.Ticker.addEventListener("tick", function() {
    if(brigand.currentFrame == 4) {
      brigand.y = -10;
      brigand.x = 80;
    } else if(brigand.currentFrame == 5) {
      brigand.x = 140;
    } else if(brigand.currentFrame == 6) {
      brigand.x = 190;
    } else if(brigand.currentFrame == 7 || brigand.currentFrame == 8) {
      brigand.x = 190;
      brigand.y = 15;
    } else if(brigand.currentFrame == 9) {
      brigand.x = 150;
      brigand.y = -5;
    } else if(brigand.currentFrame == 10) {
      brigand.x = 120;
      brigand.y = -15;
    } else if(brigand.currentFrame == 11) {
      brigand.x = 90;
      brigand.y = -15;
    } else {
      brigand.x = 70;
      brigand.y = 25;
    }
    renderDisplay(brigand);
  });
}

function stopSprite(action, obj) {
  sprite = obj ? obj : sprite;
  sprite.gotoAndStop(0);
  battle.update(lyn);
}

function stopSprite2() {
  brigand.gotoAndStop(brigand.currentFrame);
  renderDisplay(brigand);
}

function plusFrame(c) {
  var char = window[c];
  char.gotoAndStop(char.currentFrame);
  char.currentFrame = char.currentFrame + 1;
  char.gotoAndStop(char.currentFrame);
  renderDisplay(char);
}

function minusFrame(c) {
  var char = window[c];
  char.gotoAndStop(char.currentFrame);
  char.currentFrame = char.currentFrame - 1;
  char.gotoAndStop(char.currentFrame);
  renderDisplay(char);
}

function handleYOffsetChange(e, c) {
  window[c].y = e.value;
  renderDisplay(window[c]);
}

function handleXOffsetChange(e, c) {
  window[c].x = e.value;
  renderDisplay(window[c]);
}

function renderDisplay(c) {
  var fd = document.getElementById(c.wid + '-current-frame');
  var xd = document.getElementById(c.wid + '-x-offset');
  var yd = document.getElementById(c.wid + '-y-offset');
  fd.textContent = c.currentFrame;
  modifyLynX(c.currentFrame);
  if(xd.value.length === 0 && yd.value.length === 0) {
    xd.value = c.x;
    yd.value = c.y;
  }
  battle.update();
}

function modifyLynX(f) {
  switch(f) {
    case 4:
      lyn.x = 200;
      break;
    case 5:
      lyn.x = 170;
      break;
    case 6:
    case 7:
    case 8:
      lyn.x = 200;
      break;
    default:
      lyn.x = 230;
      break;
  }
  return;
}
