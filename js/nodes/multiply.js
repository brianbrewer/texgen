/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Multiply = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Multiply");

            this.Input.Top = new brianbrewer.Input("ImageData", true);
            this.Input.Bottom = new brianbrewer.Input("ImageData", true);
            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Blending";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var topData,
                bottomData,
                topPixelData,
                bottomPixelData,
                topTotal,
                bottomTotal,
                context,
                i;

            topData = this.Input.Top.Data.imagedata;
            bottomData = this.Input.Bottom.Data.imagedata;

            topPixelData = topData.data;
            bottomPixelData = bottomData.data;

            context = this.ComputeCanvas.getContext("2d");

            for (i = 0; i < topPixelData.length; i += 4) {
                topPixelData[i] = topPixelData[i] * bottomPixelData[i] / 255;
                topPixelData[i + 1] = topPixelData[i + 1] * bottomPixelData[i + 1] / 255;
                topPixelData[i + 2] = topPixelData[i + 2] * bottomPixelData[i + 2] / 255;
            }

            context.putImageData(topData, 0, 0);

            this.Output.Image.Data.imagedata = topData;
        }
    });
}());
