import Terrain from '../maps/Terrain.js';

function Tile(col, row, key) {
  var obj = Terrain[key];
  this.col = col;
  this.row = row;
  this.tid = obj.tid;
  this.type = obj.type;
  this.avo = obj.avo;
  this.def = obj.def;
  this.regen = obj.regen;
  this.collide = obj.collide;
  this.character = null;
  this.canMoveTo = false;
  this.canAttack = false;
  this.moveTile = false;
  this.atkTile = false;
  this.addCharacter = function(c) {
    if(this.character === null) {
      this.character = c;
      return;
    } else {
      console.error('There is already a character in that tile');
      return;
    }
  }
  this.removeCharacter = function() {
    this.character = null;
    return;
  }
  this.requestMove = function(c) {
    var self = this;
    if(!this.collide && this.moveTile && !this.atkTile && this.character === null) {
      this.character = c;
      this.canMoveTo = false;
      return true;
    } else {
      return false;
    }
  }
}

export default Tile;
