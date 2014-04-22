/*global brianbrewer, ClassicalNoise */

(function () {
    "use strict";
    brianbrewer.Nodes.Perlin = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Perlin");

            this.Input.Seed = new brianbrewer.Input("String", false);
            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Noise";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var context,
                PerlinObject,
                contextData,
                x,
                y,
                setPixel,
                perlinInt;

            // Get drawing context
            context = this.ComputeCanvas.getContext("2d");

            // Simple function for setting pixels
            setPixel = function (imageData, x, y, r, g, b, a) {
                var index;

                index = (x + y * imageData.width) * 4;
                imageData.data[index] = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b;
                imageData.data[index + 3] = a;
            };

            PerlinObject = new ClassicalNoise({
                random: new Math.seedrandom(this.Input.Seed.Data.String)
            });

            contextData = context.getImageData(0, 0, brianbrewer.Options.renderWidth, brianbrewer.Options.renderHeight);

            for (x = 0; x < brianbrewer.Options.renderWidth; x += 1) {
                for (y = 0; y < brianbrewer.Options.renderHeight; y += 1) {
                    perlinInt = PerlinObject.noise(x / brianbrewer.Options.renderWidth, y / brianbrewer.Options.renderHeight, 1);
                    setPixel(contextData, x, y, perlinInt * 255, perlinInt * 255, perlinInt * 255, 255);
                }
            }

            context.putImageData(contextData, 0, 0);

            // Export into output
            this.Output.Image.Data.imagedata = contextData;
        }
    });
}());
