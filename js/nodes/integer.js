/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Integer = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Integer");

            this.Output.Value = new brianbrewer.Output(new brianbrewer.Data.Integer(0));

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {}
    });
}());