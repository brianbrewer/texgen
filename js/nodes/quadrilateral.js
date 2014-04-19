/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Quadrilateral = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Arbritrary Quadrilateral");

            this.Output.Point1 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0, true));
            this.Output.Point2 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0, true));
            this.Output.Point3 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0, true));
            this.Output.Point4 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0, true));

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

            context.moveTo(this.Output.Point1.Data.X, this.Output.Point1.Data.Y);
            context.lineTo(this.Output.Point2.Data.X, this.Output.Point2.Data.Y);
            context.lineTo(this.Output.Point3.Data.X, this.Output.Point3.Data.Y);
            context.lineTo(this.Output.Point4.Data.X, this.Output.Point4.Data.Y);
            context.lineTo(this.Output.Point1.Data.X, this.Output.Point1.Data.Y);
            context.stroke();
        }
    });
}());
