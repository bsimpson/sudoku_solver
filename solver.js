var Sudoku = function() {
  var tiles = [],
      tries = 0,
      lastNumberSolved = 0;


  // Constructor function for a tile
  function Tile(row_id, column_id) {
    this.row = row_id;
    this.column = column_id;
    this.element = document.createElement('input');
    this.element.setAttribute('size', 1);
    this.element.setAttribute('maxlength', 1);
    this.element.setAttribute('tabIndex', tiles.length+1);

    tiles.push(this);
    return this;
  }

  // Draws tiles, and wraps each row inside of a div for formatting purposes
  function drawGrid() {
    var form = document.getElementsByTagName('form')[0];
    for (var x=1; x < 10; x++) {
      var row = document.createElement('div');
      for (var y=1; y < 10; y++) {
        var tile = new Tile();
        tile.row = x;
        tile.column = y;
        row.appendChild(tile.element);
      }
      form.appendChild(row);
    }
  }

  function solve() {
    for (var x=1; x < 10; x++) {
      for (var y=1; y < 10; y++) {
        if (getTileByRowAndColumn(x,y).element.value == "") {
          calculateByRowColumnAndQuadrant(x, y);
          calculateByInferrence(x, y);
        }
      }
    }

    // recursion
    var numberSolved = getValuesFromTiles(tiles).length;

    if ((numberSolved != lastNumberSolved) && (numberSolved < tiles.length)) {
      lastNumberSolved = numberSolved;
      solve();
    }
  }

  function calculateByRowColumnAndQuadrant(row, column) {
    var pool = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var known = [];

    var rowValues = valuesFromRow(row);
    for (var z=0; z < rowValues.length; z++) {
      known.push(rowValues[z]);
    }

    var columnValues = valuesFromColumn(column);
    for (var z=0; z < columnValues.length; z++) {
       known.push(columnValues[z]);
    }

    var quadrantValues = valuesFromQuadrant(row,column);
    for (var z=0; z < quadrantValues.length; z++) {
      known.push(quadrantValues[z]);
    }

    // TODO uniq
          
    // Remove known numbers from the pool
    for (var z=0; z < known.length; z++) {
      var position = pool.indexOf(known[z]);
      if (position != -1) {
        pool.splice(position, 1);
      }
    }


    if (pool.length == 1) {
      // solvable
      getTileByRowAndColumn(row, column).element.value = pool[0];
    }
  }

  function calculateByInferrence(row, column) {
    var rows = [], columns = [], quadrant = [];
    if (row <= 3) {
      rows = [1,2,3];
    } else if ( row > 3 && row <= 6) {
      rows = [4,5,6];
    } else if ( row > 6) {
      rows = [7,8,9];
    }

    if (column <=3) {
      columns = [1,2,3];
    } else if (column > 3 && column <= 6) {
      columns = [4,5,6];
    } else if (column > 6) {
      columns = [7,8,9];
    }

    for (row in rows) {
      for (column in columns) {
        var x = rows[row];
        var y = columns[column];

        if (getTileByRowAndColumn(x,y).element.value == "") {
          
          var pool = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
          var known = [];
          var rowValues = valuesFromRow(x);
          for (var z=0; z < rowValues.length; z++) {
            known.push(rowValues[z]);
          }

          var columnValues = valuesFromColumn(y);
          for (var z=0; z < columnValues.length; z++) {
             known.push(columnValues[z]);
          }

          var quadrantValues = valuesFromQuadrant(x,y);
          for (var z=0; z < quadrantValues.length; z++) {
            known.push(quadrantValues[z]);
          }

          // TODO uniq
          
          // Remove known numbers from the pool
          for (var z=0; z < known.length; z++) {
            var position = pool.indexOf(known[z]);
            if (position != -1) {
              pool.splice(position, 1);
            }
          }

          // pool populated with options
          quadrant.push([x, y, pool]);

        } // if
      }
    }

    // quadrant is populated, see what numbers in each pool are unique
    populateTilesWithDistinctResults(quadrant);
  }

  // quadrant is [row, column, [values]]
  function populateTilesWithDistinctResults(quadrant){
    var mapOfValues = [];

    for (tile in quadrant) {
      for (value in quadrant[tile][2]) {
        mapOfValues.push(quadrant[tile][2][value]);
      }
    }

    var countFrequency = {"1":0, "2":0, "3":0, "4":0, "5":0, "6":0, "7":0, "8":0, "9":0};
    for (number in mapOfValues) {
      countFrequency[mapOfValues[number]]++;
    }

    for (key in countFrequency) {
      if (countFrequency[key] == 1) {
        for (tile in quadrant) {
          if (quadrant[tile][2].indexOf(key) != -1) {
            getTileByRowAndColumn(quadrant[tile][0], quadrant[tile][1]).element.value = key;
          }
        }
      }
    }
  }

  function getTileByRowAndColumn(row_id, column_id) {
    for (tile in tiles) {
      if ((tiles[tile].row == row_id) && (tiles[tile].column == column_id)) {
        return tiles[tile];
      }
    }
  }

  // Returns an array of tile element's values that are not empty
  function getValuesFromTiles(collection) {
    var results = [];
    for (tile in collection) {
      if ((value = collection[tile].element.value) != "") {
        results.push(value);
      }
    }
    return results;
  }

  function valuesFromRow(row) {
    var collection = [];
    for (var x=1; x < 10; x++) {
      collection.push(getTileByRowAndColumn(row, x));
    }
    return getValuesFromTiles(collection);
  }

  function valuesFromColumn(column) {
    var collection = [];
    for (var x=1; x < 10; x++) {
      collection.push(getTileByRowAndColumn(x, column));
    }
    return getValuesFromTiles(collection);
  }

  function valuesFromQuadrant(row, column) {
    var rows = [], columns = [], collection = [];
    if (row <= 3) {
      rows = [1,2,3];
    } else if ( row > 3 && row <= 6) {
      rows = [4,5,6];
    } else if ( row > 6) {
      rows = [7,8,9];
    }

    if (column <=3) {
      columns = [1,2,3];
    } else if (column > 3 && column <= 6) {
      columns = [4,5,6];
    } else if (column > 6) {
      columns = [7,8,9];
    }

    for (var x=0; x < rows.length; x++) {
      for (var y=0; y < columns.length; y++) {
        collection.push(getTileByRowAndColumn(rows[x], columns[y]));
      }
    }

    return getValuesFromTiles(collection);
  }

  function setListeners() {
    document.getElementById('submit').addEventListener('click', solve);
    document.getElementById('populate').addEventListener('click', populate);
    for (tile in tiles) {
      tiles[tile].element.addEventListener('keyup', advance);
    }
    tiles[0].element.focus();
  }

  function advance() {
    if (this.value != "") {
      for (tile in tiles) {
        if (tiles[tile].element.tabIndex == this.tabIndex+1) {
          tiles[tile].element.focus();
        }
      }
    }
  }

  function populate() {
    // "Easy"
    var seed = [
      [1,2,5],
      [1,7,4],
      [2,3,6],
      [2,5,4],
      [2,7,1],
      [2,9,2],
      [3,1,2],
      [3,2,7],
      [3,4,5],
      [3,9,6],
      [4,3,5],
      [4,5,3],
      [4,9,8],
      [5,1,8],
      [5,2,2],
      [5,8,1],
      [5,9,4],
      [6,1,4],
      [6,5,7],
      [6,7,5],
      [7,1,3],
      [7,6,4],
      [7,8,8],
      [7,9,1],
      [8,1,7],
      [8,3,1],
      [8,5,6],
      [8,7,9],
      [9,3,2],
      [9,8,7]
    ];

    for (var x=0; x < seed.length; x++) {
      getTileByRowAndColumn(seed[x][0], seed[x][1]).element.value = seed[x][2];
    }
  }

  function populateExtreme() {
    var seed = [
      [1,1,7],
      [1,3,1],
      [1,5,6],
      [1,9,3],
      [3,1,3],
      [3,2,2],
      [3,6,8],
      [3,7,6],
      [3,8,1],
      [4,1,2],
      [4,4,3],
      [4,5,9],
      [4,7,7],
      [6,3,5],
      [6,5,4],
      [6,6,7],
      [6,9,2],
      [7,2,5],
      [7,3,9],
      [7,4,2],
      [7,8,3],
      [7,9,1],
      [9,1,6],
      [9,5,1],
      [9,7,5],
      [9,9,4]
    ];

    for (var x=0; x < seed.length; x++) {
      getTileByRowAndColumn(seed[x][0], seed[x][1]).element.value = seed[x][2];
    }
  }

  function init() {
    drawGrid();
    setListeners();
  }

  return {
    init: init
  };
}

window.onload = function() { 
  new Sudoku().init();
};
