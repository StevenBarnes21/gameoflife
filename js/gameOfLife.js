"use strict"
let grid1, grid2;
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 300;
// change this to 80 for an error with a cool effect
const SQUARES = 50;  
const TIMER = 200;
let running;
let coloredSquares = false;

window.onload = () => {
  document.getElementById('reset').addEventListener('click', start);
  start();
  document.getElementById('color').addEventListener('click', (e) => {
    coloredSquares = e.target.checked;
  })
};

function start() {
  setup();
  if(running)clearInterval(running);
  running = setInterval(run, TIMER);
}

function create2dArray(rows, cols) {
  
  let arr = [];
  
  for(let i = 0; i < rows; i++) {
    arr.push(new Array(cols).fill(0));
  }
  return arr;
}

function randomOnes(arr) {
  let minimum = 5;
  let numberOfOnes = 0;
  
  for(let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr[i].length; j++) {
      //randomly assign 0 or 1
      let num = Math.floor(Math.random() * 20) < 5? 1:0;
      arr[i][j] = num;
      
      numberOfOnes += num == 1 ? 1 : 0; 
    }
  }
  
  // Recursively calls this function if the array does not
  // contain the minimum number of 1s
  if(numberOfOnes < minimum) randomOnes(arr);
  
}

// only used for testing
function displayArray(arr) {
  for(let col = 0; col < arr.length; col++) {    
    console.log(arr[col]);
  }
}

function update(arr1, arr2) {
  // New values need to be calculated based on the 
  // current values of arr1 as updating them as we 
  // go would not work.
  for(let col = 0; col < arr1.length; col++){
    for(let row = 0; row < arr1[col].length; row++){
      let val = checkNeighbours(arr1, row, col);
      val = val != undefined ? val : 0;
      arr2[col][row] = val;
    }
  }

  copyArray(arr1, arr2);
}

// Used to copy nested array
function copyArray(arr1, arr2) {
  for(let i = 0; i < arr1.length; i++) {
    for(let j = 0; j < arr1[0].length; j++) {
      arr1[i][j] = arr2[i][j];
    }
  }
}


function checkNeighbours(arr, currentRow = 0, currentCol = 0) {
  // This function either returns 0 or 1 based on the rules
  // of the game of life
  
 let state = arr[currentCol][currentRow];

 let up = 0;
 let down = 0;
 let left = 0;
 let right = 0;
 let diagDownLeft = 0;
 let diagDownRight = 0;
 let diagUpLeft = 0;
 let diagUpRight = 0;

 if(currentCol > 0) {
   up = arr[currentCol-1][currentRow] || 0;
   diagUpLeft    = arr[currentCol-1][currentRow-1] || 0;
   diagUpRight   = arr[currentCol-1][currentRow+1] || 0;
 }

 if(currentCol < arr.length-1) {
   down  = (arr[currentCol+1][currentRow] || 0);
   diagDownLeft  = arr[currentCol+1][currentRow-1] || 0;
   diagDownRight = arr[currentCol+1][currentRow+1] || 0;
 }

 left  = (arr[currentCol][currentRow-1] || 0);
 right = (arr[currentCol][currentRow+1] || 0);

  // count neighbours
  let neighbours = up + down + left + right +
                   diagUpLeft + diagUpRight + 
                   diagDownLeft + diagDownRight ;
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    if(state == 1 && neighbours < 2) return 0;
  
    // Any live cell with two or three live neighbours lives on to the next generation.
    if(state == 1 && (neighbours == 2 || neighbours == 3)) return 1;
  
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    if(state == 1 && neighbours > 3) return 0;
  
// /    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    if(state == 0 & neighbours == 3) return 1;
}

function setup() {
  grid1 = create2dArray(50,50);
  grid2 = create2dArray(50,50);
  randomOnes(grid1);
}

function run() {
  update(grid1, grid2);
  drawGrid();
}

let newColor = getNextColor();
function drawGrid() {
  const size = canvas.width / SQUARES;
  
  ctx.strokeStyle = '#000';
  for(let i = 0; i < SQUARES; i++) {
    for(let j = 0; j < SQUARES; j++) {
  
      if(grid1[i][j] == 1) {
        if(coloredSquares){
           // Uses a closure to produce the next hsl color
           ctx.fillStyle = newColor();
        } else {
           ctx.fillStyle = '#000';
        }
        
      } else {
        ctx.fillStyle = '#FFF';
      }

      ctx.fillRect(i*size, j*size, size-1, size-1);
    }
  }
}

function getRandomColor() {
  let red = parseInt(Math.random() * 155).toString(16).padStart(2,'0');
  let green = parseInt(Math.random() * 155).toString(16).padStart(2,'0');
  let blue = parseInt(Math.random() * 155).toString(16).padStart(2,'0');
  return '#' + red + green + blue;
}

function getNextColor() {

  let h = 0;

  let nextColor = () => {
    h++;
    return `hsl(${h}, 100%, 50%)`;
  }

  return nextColor;
}