function Brigand() {
  this.wid = 'brigand';
  this.posRow = 3;
  this.posCol = 4;
  this.src = 'assets/images/animations/enemy/brigand-clean.png';
  this.mv = 4;
  this.images = [];
  this.frames = [
    [0, 230, 17, 17],
    [23, 230, 17, 17],
    [46, 230, 17, 17]
  ];
  this.animations = {
    'idle': {
      frames: [0, 1, 2, 1],
      next: 'idle',
      framerate: 2
    }
  };
  this.battle = {
    wid: 'brigand',
    posX: 150,
    posY: 25,
    images: [],
    frames: [
      [3, 0, 38, 54],
      [46, 0, 38, 54],
      [94, 0, 36, 54],
      [140, 0, 36, 54],
      [188, 0, 38, 74],
      [236, 0, 41, 59],
      [281, 0, 41, 59],
      [326, 0, 43, 56],
      [374, 0, 41, 56],
      [418, 0, 42, 56],
      [0, 60, 31, 59],
      [41, 60, 26, 54]
    ],
    animations: {
      idle: 0,
      attack: [0, 1, 'twist', .4],
      twist: [1, 4, 'jump', .7],
      jump: [5, 5, 'strike', .7],
      strike: [6, 7, 'retreat', .5],
      retreat: [8, 9, 'land', .4],
      land: [10, 11, 'idle', .4]
    }
  }
};
