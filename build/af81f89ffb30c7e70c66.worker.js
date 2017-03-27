/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

eval("onmessage = function(e) {\n  // Current character coords\n  var col = e.data.col;\n  var row = e.data.row;\n  var tMap = e.data.tMap;\n  var mv = e.data.mv;\n  var pxPerCol = e.data.canvasWidth / e.data.totalCols;\n  var pxPerRow = e.data.canvasHeight / e.data.totalRows;\n  var cw = e.data.canvasWidth;\n  var ch = e.data.canvasHeight;\n  var mvTotal = mv + e.data.atk;\n\n  (function buildIndeces() {\n    var matrixArr = [];\n    for(var i=0; i <= mvTotal; i++) {\n      for(var idx=0; idx<= mvTotal; idx++) {\n        if(idx + i <= mvTotal && idx + i !== 0) {\n          matrixArr.push([idx, i]);\n        }\n      }\n    }\n    buildMatrices(matrixArr);\n  })();\n\n  function buildMatrices(arr) {\n    var newMatrix = [];\n    var atkMatrix = [];\n    var arrCache = [];\n\n    arr.forEach(function(item) {\n      var newItem = [];\n      var cacheString = '';\n      newItem[0] = (col + item[0]) * pxPerCol;\n      newItem[1] = (row + item[1]) * pxPerRow;\n      cacheString = newItem[0] + ', ' + newItem[1];\n      if(arrCache.indexOf(cacheString) === -1 && col + item[0] <= e.data.totalCols && col + item[0] >= 0 && row + item[1] <= e.data.totalRows) {\n        arrCache.push(cacheString);\n        if(item[0] + item[1] <= mv) {\n          newMatrix.push(newItem);\n        } else if(item[0] + item[1] == mvTotal) {\n          atkMatrix.push(newItem);\n        }\n      }\n      newItem = [];\n      newItem[0] = (col - item[0]) * pxPerCol;\n      newItem[1] = (row - item[1]) * pxPerRow;\n      cacheString = newItem[0] + ', ' + newItem[1];\n      if(arrCache.indexOf(cacheString) === -1 && col - item[0] <= cw && e.data.totalCols >= 0 && row - item[1] <= e.data.totalRows) {\n        arrCache.push(cacheString);\n        if(item[0] + item[1] <= mv) {\n          newMatrix.push(newItem);\n        } else if(item[0] + item[1] == mvTotal) {\n          atkMatrix.push(newItem);\n        }\n      }\n      newItem = [];\n      newItem[0] = (col + item[0]) * pxPerCol;\n      newItem[1] = (row - item[1]) * pxPerRow;\n      cacheString = newItem[0] + ', ' + newItem[1];\n      if(arrCache.indexOf(cacheString) === -1 && col + item[0] <= e.data.totalCols && col + item[0] >= 0 && row - item[1] <= e.data.totalRows) {\n        arrCache.push(cacheString);\n        if(item[0] + item[1] <= mv) {\n          newMatrix.push(newItem);\n        } else if(item[0] + item[1] == mvTotal) {\n          atkMatrix.push(newItem);\n        }\n      }\n      newItem = [];\n      newItem[0] = (col - item[0]) * pxPerCol;\n      newItem[1] = (row + item[1]) * pxPerRow;\n      cacheString = newItem[0] + ', ' + newItem[1];\n      if(arrCache.indexOf(cacheString) === -1 && col - item[0] <= e.data.totalCols && col - item[0] >= 0 && row + item[1] <= e.data.totalRows) {\n        arrCache.push(cacheString);\n        if(item[0] + item[1] <= mv) {\n          newMatrix.push(newItem);\n        } else if(item[0] + item[1] == mvTotal) {\n          atkMatrix.push(newItem);\n        }\n      }\n    })\n    var filteredMatrix = newMatrix.filter(function(index) {\n      var newCol = Math.floor(index[0] / pxPerCol);\n      var newRow = Math.floor(index[1] / pxPerRow);\n      console.log(tMap);\n      if(!tMap[newRow][newCol].collide) {\n        return index;\n      } else {\n        atkMatrix.push(index);\n      }\n    });\n    postMessage([filteredMatrix, atkMatrix, e.data.col, e.data.row]);\n  }\n}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy93b3JrZXJzL21vdmUtd29ya2VyLmpzPzdhMjAiXSwic291cmNlc0NvbnRlbnQiOlsib25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAvLyBDdXJyZW50IGNoYXJhY3RlciBjb29yZHNcbiAgdmFyIGNvbCA9IGUuZGF0YS5jb2w7XG4gIHZhciByb3cgPSBlLmRhdGEucm93O1xuICB2YXIgdE1hcCA9IGUuZGF0YS50TWFwO1xuICB2YXIgbXYgPSBlLmRhdGEubXY7XG4gIHZhciBweFBlckNvbCA9IGUuZGF0YS5jYW52YXNXaWR0aCAvIGUuZGF0YS50b3RhbENvbHM7XG4gIHZhciBweFBlclJvdyA9IGUuZGF0YS5jYW52YXNIZWlnaHQgLyBlLmRhdGEudG90YWxSb3dzO1xuICB2YXIgY3cgPSBlLmRhdGEuY2FudmFzV2lkdGg7XG4gIHZhciBjaCA9IGUuZGF0YS5jYW52YXNIZWlnaHQ7XG4gIHZhciBtdlRvdGFsID0gbXYgKyBlLmRhdGEuYXRrO1xuXG4gIChmdW5jdGlvbiBidWlsZEluZGVjZXMoKSB7XG4gICAgdmFyIG1hdHJpeEFyciA9IFtdO1xuICAgIGZvcih2YXIgaT0wOyBpIDw9IG12VG90YWw7IGkrKykge1xuICAgICAgZm9yKHZhciBpZHg9MDsgaWR4PD0gbXZUb3RhbDsgaWR4KyspIHtcbiAgICAgICAgaWYoaWR4ICsgaSA8PSBtdlRvdGFsICYmIGlkeCArIGkgIT09IDApIHtcbiAgICAgICAgICBtYXRyaXhBcnIucHVzaChbaWR4LCBpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgYnVpbGRNYXRyaWNlcyhtYXRyaXhBcnIpO1xuICB9KSgpO1xuXG4gIGZ1bmN0aW9uIGJ1aWxkTWF0cmljZXMoYXJyKSB7XG4gICAgdmFyIG5ld01hdHJpeCA9IFtdO1xuICAgIHZhciBhdGtNYXRyaXggPSBbXTtcbiAgICB2YXIgYXJyQ2FjaGUgPSBbXTtcblxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHZhciBuZXdJdGVtID0gW107XG4gICAgICB2YXIgY2FjaGVTdHJpbmcgPSAnJztcbiAgICAgIG5ld0l0ZW1bMF0gPSAoY29sICsgaXRlbVswXSkgKiBweFBlckNvbDtcbiAgICAgIG5ld0l0ZW1bMV0gPSAocm93ICsgaXRlbVsxXSkgKiBweFBlclJvdztcbiAgICAgIGNhY2hlU3RyaW5nID0gbmV3SXRlbVswXSArICcsICcgKyBuZXdJdGVtWzFdO1xuICAgICAgaWYoYXJyQ2FjaGUuaW5kZXhPZihjYWNoZVN0cmluZykgPT09IC0xICYmIGNvbCArIGl0ZW1bMF0gPD0gZS5kYXRhLnRvdGFsQ29scyAmJiBjb2wgKyBpdGVtWzBdID49IDAgJiYgcm93ICsgaXRlbVsxXSA8PSBlLmRhdGEudG90YWxSb3dzKSB7XG4gICAgICAgIGFyckNhY2hlLnB1c2goY2FjaGVTdHJpbmcpO1xuICAgICAgICBpZihpdGVtWzBdICsgaXRlbVsxXSA8PSBtdikge1xuICAgICAgICAgIG5ld01hdHJpeC5wdXNoKG5ld0l0ZW0pO1xuICAgICAgICB9IGVsc2UgaWYoaXRlbVswXSArIGl0ZW1bMV0gPT0gbXZUb3RhbCkge1xuICAgICAgICAgIGF0a01hdHJpeC5wdXNoKG5ld0l0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBuZXdJdGVtID0gW107XG4gICAgICBuZXdJdGVtWzBdID0gKGNvbCAtIGl0ZW1bMF0pICogcHhQZXJDb2w7XG4gICAgICBuZXdJdGVtWzFdID0gKHJvdyAtIGl0ZW1bMV0pICogcHhQZXJSb3c7XG4gICAgICBjYWNoZVN0cmluZyA9IG5ld0l0ZW1bMF0gKyAnLCAnICsgbmV3SXRlbVsxXTtcbiAgICAgIGlmKGFyckNhY2hlLmluZGV4T2YoY2FjaGVTdHJpbmcpID09PSAtMSAmJiBjb2wgLSBpdGVtWzBdIDw9IGN3ICYmIGUuZGF0YS50b3RhbENvbHMgPj0gMCAmJiByb3cgLSBpdGVtWzFdIDw9IGUuZGF0YS50b3RhbFJvd3MpIHtcbiAgICAgICAgYXJyQ2FjaGUucHVzaChjYWNoZVN0cmluZyk7XG4gICAgICAgIGlmKGl0ZW1bMF0gKyBpdGVtWzFdIDw9IG12KSB7XG4gICAgICAgICAgbmV3TWF0cml4LnB1c2gobmV3SXRlbSk7XG4gICAgICAgIH0gZWxzZSBpZihpdGVtWzBdICsgaXRlbVsxXSA9PSBtdlRvdGFsKSB7XG4gICAgICAgICAgYXRrTWF0cml4LnB1c2gobmV3SXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG5ld0l0ZW0gPSBbXTtcbiAgICAgIG5ld0l0ZW1bMF0gPSAoY29sICsgaXRlbVswXSkgKiBweFBlckNvbDtcbiAgICAgIG5ld0l0ZW1bMV0gPSAocm93IC0gaXRlbVsxXSkgKiBweFBlclJvdztcbiAgICAgIGNhY2hlU3RyaW5nID0gbmV3SXRlbVswXSArICcsICcgKyBuZXdJdGVtWzFdO1xuICAgICAgaWYoYXJyQ2FjaGUuaW5kZXhPZihjYWNoZVN0cmluZykgPT09IC0xICYmIGNvbCArIGl0ZW1bMF0gPD0gZS5kYXRhLnRvdGFsQ29scyAmJiBjb2wgKyBpdGVtWzBdID49IDAgJiYgcm93IC0gaXRlbVsxXSA8PSBlLmRhdGEudG90YWxSb3dzKSB7XG4gICAgICAgIGFyckNhY2hlLnB1c2goY2FjaGVTdHJpbmcpO1xuICAgICAgICBpZihpdGVtWzBdICsgaXRlbVsxXSA8PSBtdikge1xuICAgICAgICAgIG5ld01hdHJpeC5wdXNoKG5ld0l0ZW0pO1xuICAgICAgICB9IGVsc2UgaWYoaXRlbVswXSArIGl0ZW1bMV0gPT0gbXZUb3RhbCkge1xuICAgICAgICAgIGF0a01hdHJpeC5wdXNoKG5ld0l0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBuZXdJdGVtID0gW107XG4gICAgICBuZXdJdGVtWzBdID0gKGNvbCAtIGl0ZW1bMF0pICogcHhQZXJDb2w7XG4gICAgICBuZXdJdGVtWzFdID0gKHJvdyArIGl0ZW1bMV0pICogcHhQZXJSb3c7XG4gICAgICBjYWNoZVN0cmluZyA9IG5ld0l0ZW1bMF0gKyAnLCAnICsgbmV3SXRlbVsxXTtcbiAgICAgIGlmKGFyckNhY2hlLmluZGV4T2YoY2FjaGVTdHJpbmcpID09PSAtMSAmJiBjb2wgLSBpdGVtWzBdIDw9IGUuZGF0YS50b3RhbENvbHMgJiYgY29sIC0gaXRlbVswXSA+PSAwICYmIHJvdyArIGl0ZW1bMV0gPD0gZS5kYXRhLnRvdGFsUm93cykge1xuICAgICAgICBhcnJDYWNoZS5wdXNoKGNhY2hlU3RyaW5nKTtcbiAgICAgICAgaWYoaXRlbVswXSArIGl0ZW1bMV0gPD0gbXYpIHtcbiAgICAgICAgICBuZXdNYXRyaXgucHVzaChuZXdJdGVtKTtcbiAgICAgICAgfSBlbHNlIGlmKGl0ZW1bMF0gKyBpdGVtWzFdID09IG12VG90YWwpIHtcbiAgICAgICAgICBhdGtNYXRyaXgucHVzaChuZXdJdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgdmFyIGZpbHRlcmVkTWF0cml4ID0gbmV3TWF0cml4LmZpbHRlcihmdW5jdGlvbihpbmRleCkge1xuICAgICAgdmFyIG5ld0NvbCA9IE1hdGguZmxvb3IoaW5kZXhbMF0gLyBweFBlckNvbCk7XG4gICAgICB2YXIgbmV3Um93ID0gTWF0aC5mbG9vcihpbmRleFsxXSAvIHB4UGVyUm93KTtcbiAgICAgIGNvbnNvbGUubG9nKHRNYXApO1xuICAgICAgaWYoIXRNYXBbbmV3Um93XVtuZXdDb2xdLmNvbGxpZGUpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRrTWF0cml4LnB1c2goaW5kZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHBvc3RNZXNzYWdlKFtmaWx0ZXJlZE1hdHJpeCwgYXRrTWF0cml4LCBlLmRhdGEuY29sLCBlLmRhdGEucm93XSk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL3dvcmtlcnMvbW92ZS13b3JrZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ })
/******/ ]);