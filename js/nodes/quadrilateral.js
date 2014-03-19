/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Quadrilateral = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Arbritrary Quadrilateral");

            this.Output.Point1 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0));
            this.Output.Point2 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0));
            this.Output.Point3 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0));
            this.Output.Point4 = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0));

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {}
    });
}());