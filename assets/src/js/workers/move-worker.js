onmessage = function(e) {
  // Current character coords
  var col = e.data.col - 1;
  var row = e.data.row - 1;
  var mv = e.data.mv;
  var pxPerCol = e.data.canvasWidth / e.data.totalCols;
  var pxPerRow = e.data.canvasHeight / e.data.totalRows;
  var cw = e.data.canvasWidth;
  var ch = e.data.canvasHeight;
  var mvTotal = mv + e.data.atk;

  (function buildIndeces() {
    var matrixArr = [];
    for(var i=0; i <= mvTotal; i++) {
      for(var idx=0; idx<= mvTotal; idx++) {
        if(idx + i <= mvTotal && idx + i !== 0) {
          matrixArr.push([idx, i]);
        }
      }
    }
    buildMatrices(matrixArr);
  })();

  function buildMatrices(arr) {
    var newMatrix = [];
    var atkMatrix = [];
    var arrCache = [];

    arr.forEach(function(item) {
      var newItem = [];
      var cacheString = '';
      newItem[0] = (col + item[0]) * pxPerCol;
      newItem[1] = (row + item[1]) * pxPerRow;
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
        arrCache.push(cacheString);
        if(item[0] + item[1] < mvTotal) {
          newMatrix.push(newItem);
        } else {
          atkMatrix.push(newItem);
        }
      }
      newItem = [];
      newItem[0] = (col - item[0]) * pxPerCol;
      newItem[1] = (row - item[1]) * pxPerRow;
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
        arrCache.push(cacheString);
        if(item[0] + item[1] < mvTotal) {
          newMatrix.push(newItem);
        } else {
          atkMatrix.push(newItem);
        }
      }
      newItem = [];
      newItem[0] = (col + item[0]) * pxPerCol;
      newItem[1] = (row - item[1]) * pxPerRow;
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
        arrCache.push(cacheString);
        if(item[0] + item[1] < mvTotal) {
          newMatrix.push(newItem);
        } else {
          atkMatrix.push(newItem);
        }
      }
      newItem = [];
      newItem[0] = (col - item[0]) * pxPerCol;
      newItem[1] = (row + item[1]) * pxPerRow;
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && newItem[0] <= cw && newItem[0] >= 0 && newItem[1] <= ch) {
        arrCache.push(cacheString);
        if(item[0] + item[1] < mvTotal) {
          newMatrix.push(newItem);
        } else {
          atkMatrix.push(newItem);
        }
      }
    })
    post(newMatrix, atkMatrix);
  }
}

function post(m1, m2) {
  postMessage([m1, m2]);
}
