/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Final = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Final Node");

            this.Input.Image = new brianbrewer.Input("ImageData", true);

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            console.log("Rendering " + this.Title);
        }
    });
}());
