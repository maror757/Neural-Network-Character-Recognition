const sketch = function (p) {
    // Other variables
    let isWriting = false
    let cnv_height = 280
    let cnv_width = 280
    let cnv

    p.setup = () => {
        cnv = p.createCanvas(cnv_height, cnv_width)
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
        var ctx = canvas.getContext('2d');
        //const image_data = ctx.getImageData(0, 0, cnv_width, cnv_height)
        
        ctx.drawImage( canvas, 0, 0, 0.1*canvas.width, 0.1*canvas.height );
        const image_data = ctx.getImageData(0, 0, 0.1*canvas.width, 0.1*canvas.height)

        console.log(image_data);
        
        return image_data
    }

    p.scale_image_data = (image_data, scale) => {
        var scaled = c.createImageData(image_data.width * scale, image_data.height * scale);

        for (var row = 0; row < image_data.height; row++) {
            for (var col = 0; col < image_data.width; col++) {
                var sourcePixel = [
                    image_data.data[(row * image_data.width + col) * 4 + 0],
                    image_data.data[(row * image_data.width + col) * 4 + 1],
                    image_data.data[(row * image_data.width + col) * 4 + 2],
                    image_data.data[(row * image_data.width + col) * 4 + 3]
                ];
                for (var y = 0; y < scale; y++) {
                    var destRow = row * scale + y;
                    for (var x = 0; x < scale; x++) {
                        var destCol = col * scale + x;
                        for (var i = 0; i < 4; i++) {
                            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
                                sourcePixel[i];
                        }
                    }
                }
            }
        }

        return scaled;
    }

    p.clear_pixels = () => {
        cnv.background(0)
        console.log('clear canvas');
    }
};

export default sketch
