/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Colour = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Colour");

            this.Input.Top = new brianbrewer.Input("Colour", false);
            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Basic";

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
                contextData,
                i;

            topData = this.Input.Top.Data.imagedata;
            bottomData = this.Input.Bottom.Data.imagedata;

            topPixelData = topData.data;
            bottomPixelData = bottomData.data;

            context = this.ComputeCanvas.getContext("2d");
            contextData = context.getImageData(0, 0, brianbrewer.Options.renderWidth, brianbrewer.Options.renderWidth);

            for (i = 0; i < topData.length; i += 4) {
                contextData.data[i] = topPixelData[i] > bottomPixelData[i] ? bottomPixelData[i] : topPixelData[i];
                contextData.data[i + 1] = topPixelData[i + 1] > bottomPixelData[i + 1] ? bottomPixelData[i + 1] : topPixelData[i + 1];
                contextData.data[i + 2] = topPixelData[i + 2] > bottomPixelData[i + 2] ? bottomPixelData[i + 2] : topPixelData[i + 2];
            }

            context.putImageData(contextData, 0, 0);

            this.Output.Image.Data.imagedata = contextData;
        }
    });
}());
