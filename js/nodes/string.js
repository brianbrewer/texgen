/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.String = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "String");

            this.Output.Value = new brianbrewer.Output(new brianbrewer.Data.String("", true));

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();
        }
    });
}());
