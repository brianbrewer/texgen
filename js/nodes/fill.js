/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Fill = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Fill");

            this.Input.Colour = new brianbrewer.Input("Colour", false);
            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var context;

            context = this.ComputeCanvas.getContext("2d");
            context.fillStyle = this.Input.Colour.Data.Hex;
            context.fillRect(0, 0, brianbrewer.Options.renderWidth, brianbrewer.Options.renderHeight);
            this.Output.Image.Data.imagedata = context.getImageData(0, 0, brianbrewer.Options.renderWidth, brianbrewer.Options.renderHeight);
        }
    });
}());
