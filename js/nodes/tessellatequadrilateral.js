/*global brianbrewer */

//@TODO: Complete
(function () {
    "use strict";
    brianbrewer.Nodes.TessellateQuadrilateral = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Arbritrary Quadrilateral Tessellation");

            this.Input.Point1 = new brianbrewer.Input("Point", true);
            this.Input.Point2 = new brianbrewer.Input("Point", true);
            this.Input.Point3 = new brianbrewer.Input("Point", true);
            this.Input.Point4 = new brianbrewer.Input("Point", true);

            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Tessellate";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            console.log("Rendering " + this.Title);
        }
    });
}());
