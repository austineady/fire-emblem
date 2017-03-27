onmessage = function(e) {
  // Current character coords
  var col = e.data.col;
  var row = e.data.row;
  var tMap = e.data.tMap;
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
      if(arrCache.indexOf(cacheString) === -1 && col + item[0] <= e.data.totalCols && col + item[0] >= 0 && row + item[1] <= e.data.totalRows) {
        arrCache.push(cacheString);
        if(item[0] + item[1] <= mv) {
          newMatrix.push(newItem);
        } else if(item[0] + item[1] == mvTotal) {
          atkMatrix.push(newItem);
        }
      }
      newItem = [];
      newItem[0] = (col - item[0]) * pxPerCol;
      newItem[1] = (row - item[1]) * pxPerRow;
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && col - item[0] <= cw && e.data.totalCols >= 0 && row - item[1] <= e.data.totalRows) {
        arrCache.push(cacheString);
        if(item[0] + item[1] <= mv) {
          newMatrix.push(newItem);
        } else if(item[0] + item[1] == mvTotal) {
          atkMatrix.push(newItem);
        }
      }
      newItem = [];
      newItem[0] = (col + item[0]) * pxPerCol;
      newItem[1] = (row - item[1]) * pxPerRow;
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && col + item[0] <= e.data.totalCols && col + item[0] >= 0 && row - item[1] <= e.data.totalRows) {
        arrCache.push(cacheString);
        if(item[0] + item[1] <= mv) {
          newMatrix.push(newItem);
        } else if(item[0] + item[1] == mvTotal) {
          atkMatrix.push(newItem);
        }
      }
      newItem = [];
      newItem[0] = (col - item[0]) * pxPerCol;
      newItem[1] = (row + item[1]) * pxPerRow;
      cacheString = newItem[0] + ', ' + newItem[1];
      if(arrCache.indexOf(cacheString) === -1 && col - item[0] <= e.data.totalCols && col - item[0] >= 0 && row + item[1] <= e.data.totalRows) {
        arrCache.push(cacheString);
        if(item[0] + item[1] <= mv) {
          newMatrix.push(newItem);
        } else if(item[0] + item[1] == mvTotal) {
          atkMatrix.push(newItem);
        }
      }
    })
    var filteredMatrix = newMatrix.filter(function(index) {
      var newCol = Math.floor(index[0] / pxPerCol);
      var newRow = Math.floor(index[1] / pxPerRow);
      console.log(tMap);
      if(!tMap[newRow][newCol].collide) {
        return index;
      } else {
        atkMatrix.push(index);
      }
    });
    postMessage([filteredMatrix, atkMatrix, e.data.col, e.data.row]);
  }
}
