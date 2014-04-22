/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Fill = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Darken Blend");

            this.Input.Colour = new brianbrewer.Input("Colour", false);
            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Blending";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var context;


        }
    });
}());
