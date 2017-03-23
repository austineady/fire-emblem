// Terrain Map
// 0 unwalkable
// 1 plains
// 2 woods
// 3 sand
// 4 mountains
// 5 peak
// 6 sea
// 7 fortress
// 8 village
// 9 pillar
// 10 throne
// 11 Armory
// 12 Vendor
// 13 Arena
// 14 House
// 15 Inn
// 16 Ruins
// Semantic Locations
// 1.1 Barrel
// 1.2 Brace
// 1.3 Bridge
// 1.4 Bone
// 1.5 Chest
// 1.6 Door
// 1.7 Deck
// 1.8 Fence
// 1.9 Floor
// 1.10 Road
// 1.11 River
// 1.12 Stairs
// 1.13 Thicket
// 1.14 Wall
// 0.1 Cliff
var maps = {
  level0: {
    background: 'assets/images/background/bg-map-1.png',
    terrain: [
      // Row 1
      [4, 4, 0, 0, 0, 1, 1, 2, 1, 4, 4, 5, 5, 5, 5],
      // Row 2
      [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 4, 4, 5, 5],
      // Row 3
      [1, 1, 0, 7, 0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4],
      // Row 4
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      // Row 5
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      // Row 6
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      // Row 7
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      // Row 8
      [0.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      // Row 9
      [0.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.1, 2, 1],
      // Row 10
      [0.1, 1, 2, 1, 1, 1, 1, 1, 1, 0.1, 0.1, 0.1, 0.1, 1, 14]
    ]
  }
};

export default maps;
