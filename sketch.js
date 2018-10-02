<<<<<<< Updated upstream
// Global variables
let isWriting = false
let cnv_height = 280
let cnv_width = 280
let cnv_pos_x = 10
let cnv_pos_y = 100
let cnv_graphics

let prev_second = 0

// Setup (runs one time on start)
function setup() {
  // Create canvas
  let cnv = createCanvas(cnv_height, cnv_width)
  cnv.position(cnv_pos_x, cnv_pos_y);
  
  // Create graphics
  cnv_graphics = createGraphics(cnv_height, cnv_width);
  //cnv.position(cnv_pos_x, cnv_pos_y);
  cnv_graphics.background(0)
  cnv_graphics.stroke(255)
  cnv_graphics.strokeWeight(8)
=======
function setup() {
  createCanvas(280, 280)
  background(0)
  stroke(255)
  strokeWeight(5)
>>>>>>> Stashed changes

  // Listening if the user is writing to the canvas.
  // Sets isWriting to true/false
  // Fires predict when a writing session is done
  const setIsWriting = (b) => {
    if (b) {
      isWriting = true
    } else if (!b && isWriting) {
      isWriting = false
      predict() 
    }
  }

  cnv.mousePressed( function() { setIsWriting(true) })
  cnv.mouseReleased( function() { setIsWriting(false) })
  cnv.mouseOut( function() { setIsWriting(false) })

  // Create reset and train buttons
  let resetButton = createButton("reset")
  resetButton.mousePressed(() => {
    console.log("reset sketch")
    cnv_graphics.background(0)
  })
  let trainButton = createButton("train")
  trainButton.mousePressed(() => {
    console.log("training")
  })
}

<<<<<<< Updated upstream
// Draw (loops all the time)
function draw() {
  // Is the user writing on the canvas?
  if (isWriting) {
    cnv_graphics.line(mouseX, mouseY, pmouseX, pmouseY);
    // Predict every 3 sec (lags)
    //if (prev_second + 3 < second() || (second() == 0 && prev_second != 0)) {
      //prev_second = second()
      //predict()
    //}
  }
  // Write graphics to canvas
  image(cnv_graphics, 0, 0);
  // Blur
  filter(BLUR, 1.5);
=======
function resetSketch() {
  console.log("resetSketch")
  clear()
  background(0)
  stroke(255)
  strokeWeight(5)
>>>>>>> Stashed changes
}

function predict() {
  console.log("predict");
  loadPixels()
  let mat = math.matrix([...pixels])

  // makes mat a 280x280 matrix 0-1
  mat = math.reshape(mat, [cnv_height, cnv_width, 4])
  mat = mat.subset(math.index(math.range(0, cnv_height), math.range(0, cnv_width), 0))
  mat = math.multiply(mat, 1/255)
  console.log("mat ", mat);
}
<<<<<<< Updated upstream
=======

function draw() {

}
>>>>>>> Stashed changes
