// Functions

function handleImageLoad(e) {
  console.log('Image Loaded:');
  console.log(e);
}

function handleImageError(e) {
  console.error('Image Error');
  console.log(e);
}

function drawCircle() {
  var circle = new createjs.Shape();
  // drawCircle(x, y, radius)
  circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  //battle.addChild(circle);
  //renderStage();
}
