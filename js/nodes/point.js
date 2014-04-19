/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Point = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Point");

            this.Output.Point = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0, true));

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var context;

            // Clear Canvas and reset size if changed
            this.ComputeCanvas.width = brianbrewer.Options.renderWidth;
            this.ComputeCanvas.height = brianbrewer.Options.renderWidth;
            context = this.ComputeCanvas.getContext("2d");

            context.arc(this.Output.Point.Data.X, this.Output.Point.Data.Y, 1, 0, 2 * Math.PI);
            context.stroke();
        }
    });
}());
