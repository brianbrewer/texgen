/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Invert = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Invert Colours");

            this.Input.Image = new brianbrewer.Input("ImageData", true);
            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var imdata,
                i,
                context,
                data;

            imdata = this.Input.Image.Data.imagedata;
            context = this.ComputeCanvas.getContext("2d");

            data = imdata.data;

            for (i = 0; i < data.length; i += 4) {
                // red
                data[i] = 255 - data[i];
                // green
                data[i + 1] = 255 - data[i + 1];
                // blue
                data[i + 2] = 255 - data[i + 2];
            }

            context.putImageData(imdata, 0, 0);

            this.Output.Image.Data.imagedata = imdata;
        }
    });
}());
