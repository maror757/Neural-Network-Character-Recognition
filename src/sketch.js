const sketch = function( p ) {
    // Other variables
    let isWriting = false
    let cnv_height = 28
    let cnv_width = 28
    let cnv

    p.setup = () => {
        cnv = p.createCanvas(cnv_height, cnv_width)
        cnv.background(0)
        cnv.stroke(255)
        cnv.strokeWeight(2)

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
        p.loadPixels();
        p.set();
        return p.pixels;
    }

    p.clear_pixels = () => {
        cnv.background(0)
        console.log('clear canvas');
    }
};

export default sketch
