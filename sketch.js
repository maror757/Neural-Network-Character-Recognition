
function setup() {
    createCanvas(800, 800);
    background(230);
  }
  
  function draw() {

  }

  function mouseDragged() 
{ 
	strokeWeight(8);
	line(mouseX, mouseY, pmouseX, pmouseY);
}