function handleStageClick(char, e) {
  var rectCol = pixelsToCols(e.stageX);
  var rectRow = pixelsToRows(e.stageY);
  char.col = rectCol;
  char.row = rectRow;
  hero = char;

  createMoveMap(5, rectCol, rectRow, char);
}

function handleRectClick(rect, e, c) {
  var targetCol = rect.col;
  var targetRow = rect.row;

  var colDiff = targetCol - hero.col;
  var rowDiff = targetRow - hero.row;

  handleMovement(colDiff, rowDiff, c);
}
