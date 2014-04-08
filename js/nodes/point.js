/*global brianbrewer */

(function () {
    "use strict";
    brianbrewer.Nodes.Point = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Point");

            this.Output.Point = new brianbrewer.Output(new brianbrewer.Data.Point(0, 0));

            this.Category = "Basic";

            this.CalculateSize();
        },
        Compute: function () {}
    });
}());