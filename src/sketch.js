const sketch = function (p) {
    // Other variables
    const scale = 20
    var isWriting = false
    var cnv_height = 28*scale
    var cnv_width = 28*scale
    var cnv

    p.setup = () => {
        cnv = p.createCanvas(cnv_height, cnv_width)
        cnv.parent("canvas_container");
        cnv.background(0)
        cnv.stroke(255)
        cnv.strokeWeight(2 * scale)

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

        ctx_scaled.drawImage( canvas, 0, 0, 1 / scale * canvas.width, 1 / scale *canvas.height );
        const image_data = ctx_scaled.getImageData(0, 0, 1 / scale * canvas.width, 1 / scale * canvas.height)

        //console.log(image_data);

        return image_data
    }

    p.clear_pixels = () => {
        cnv.background(0)
        console.log('clear canvas');
    }
};

export default sketch
