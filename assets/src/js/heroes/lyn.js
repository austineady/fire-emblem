'use strict';

function Lyn() {
  this.posRow = 9;
  this.posCol = 14;
  this.row = 9;
  this.col = 14;
  this.src = 'assets/images/overworld/overworld-characters-clean.png';
  // image to use
  this.images = [];
  // width, height, count(optional), registration x, registration y
  this.frames = [
    // x, y, width, height, imageIndex, regX, regY
    [189, 171, 16, 16],
    [189, 203, 16, 16],
    [189, 235, 16, 16]
  ];
  this.animations = {
    'idle': {
      frames: [0, 2, 1, 0],
      next: 'idle',
      framerate: 2
    }
  };
  this.battle = {
    wid: 'lyn',
    posY: 40,
    posX: 230,
    row: 9,
    col: 15,
    mv: 3,
    src: 'assets/images/animations/hero/lyn-loop.png',
    // image to use
    images: [],
    // width, height, count(optional), registration x, registration y
    frames: {width:64, height:64, count:22, regX:0, regY:0},
    animations: {
      idle: 0,
      start: {
        frames: [0, 2],
        next: 'hold',
        speed: .3
      },
      hold: {
        frames: 3,
        next: 'strike',
        speed: .1
      },
      strike: {
        frames: [4, 6],
        next: 'wait',
        speed: .5
      },
      wait: {
        frames: 7,
        next: 'jump',
        speed: .1
      },
      jump: {
        frames: 8,
        next: 'air',
        speed: .6
      },
      air: {
        frames: 9,
        next: 'land',
        speed: .2
      },
      land: {
        frames: [10, 13],
        next: 'sheathe',
        speed: .4
      },
      sheathe: {
        frames: [14, 20],
        next: 'end',
        speed: .3
      },
      end: {
        frames: [21, 22],
        next: 'idle',
        speed: .1
      }
    }
  }
};
