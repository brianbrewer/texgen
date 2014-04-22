/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Final = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Final Node");

            this.Input.Image = new brianbrewer.Input("ImageData", true);

            this.Category = "Other";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var context;

            context = this.ComputeCanvas.getContext("2d");
            context.putImageData(this.Input.Image.Data.imagedata, 0, 0);
        }
    });
}());
