/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Colour = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Colour");

            this.Input.Colour = new brianbrewer.Input("String", false);
            this.Output.Colour = new brianbrewer.Output(new brianbrewer.Data.Colour("", true));

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            //@TODO: Error checking?
            if (this.Input.Colour.Data) {
                this.Output.Colour.Data.Hex = this.Input.Colour.Data.String;
            }
        }
    });
}());
