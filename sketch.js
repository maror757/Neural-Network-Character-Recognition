

function setup() {
  createCanvas(280, 280)
  background(0)
  stroke(255)
  strokeWeight(3)

  resetSketch()

  var resetButton = createButton("reset")
  resetButton.mousePressed(resetSketch)

  var saveButton = createButton("save")
  saveButton.mousePressed(saveSketch)
}

function resetSketch() {
  console.log("resetSketch")
  clear()
  background(0)
  stroke(255)
  strokeWeight(3)
}

function saveSketch() {
  console.log("saveSketch")

  loadPixels()
  console.log(pixels)
}

function mouseDragged() {
  line(mouseX, mouseY, pmouseX, pmouseY);
}

function draw() {

}