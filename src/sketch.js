const sketch = function (p) {
    // Other variables
    let isWriting = false
    let cnv_height = 280
    let cnv_width = 280
    let cnv

    p.setup = () => {
        cnv = p.createCanvas(cnv_height, cnv_width)
        cnv.parent("drawing");
        console.log('j');
        cnv.background(0)
        cnv.stroke(255)
        cnv.strokeWeight(20)

        const isWritingDecider = (b) => {
            if (b) {
                isWriting = true
                //console.log('isWriting', isWriting);

            } else if (!b && isWriting) {
                isWriting = false
                //console.log('isWriting', isWriting);
            }
        }

        cnv.mousePressed(function () { isWritingDecider(true) })
        cnv.mouseReleased(function () { isWritingDecider(false) })
        cnv.mouseOut(function () { isWritingDecider(false) })
    }

    p.draw = () => {
        if (isWriting) {
            cnv.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        }
    }

    p.get_pixels = () => {

        var canvas = document.getElementById('defaultCanvas0');
        
        var canvas_scaled = document.createElement('canvas');
        var ctx_scaled = canvas_scaled.getContext('2d');

        ctx_scaled.drawImage( canvas, 0, 0, 0.1*canvas.width, 0.1*canvas.height );
        const image_data = ctx_scaled.getImageData(0, 0, 0.1*canvas.width, 0.1*canvas.height)

        //console.log(image_data);
        
        return image_data
    }

    p.clear_pixels = () => {
        cnv.background(0)
        console.log('clear canvas');
    }
};

export default sketch
