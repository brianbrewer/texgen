/*global brianbrewer */

//@TODO: Complete
(function () {
    "use strict";
    brianbrewer.Nodes.TesselateTriangle = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Arbritrary Triangle Tesselation");

            this.Input.Point1 = new brianbrewer.Input("Point", true);
            this.Input.Point2 = new brianbrewer.Input("Point", true);
            this.Input.Point3 = new brianbrewer.Input("Point", true);

            this.CalculateSize();
        }
    });
}());