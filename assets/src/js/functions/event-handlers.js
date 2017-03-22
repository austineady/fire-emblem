function handleRectClick(rect, e, c) {
  var targetCol = rect.col;
  var targetRow = rect.row;

  var colDiff = targetCol - hero.col;
  var rowDiff = targetRow - hero.row;

  handleMovement(colDiff, rowDiff, c);
}
