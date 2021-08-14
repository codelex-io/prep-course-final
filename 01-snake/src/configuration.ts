interface Configuration {
  maxLevel: number;
  defaultSpeed: number;
  nbCellsX: number;
  nbCellsY: number;
  width: number;
  height: number;
  cellSize: number;
}

const configuration: Configuration = {
  maxLevel: 10,
  defaultSpeed: 100,
  nbCellsX: 80,
  nbCellsY: 40,
  width: 1000,
  height: 1000,
  cellSize: 20
};

export default configuration;
