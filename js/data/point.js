/*global brianbrewer */
(function () {
    "use strict";

    // Base Graphical Data Node
    brianbrewer.Data.Point = brianbrewer.Data.GData.extend({
        init: function (x, y) {
            this.sup();
            this.X = x;
            this.Y = y;
            this.Type = "Point";
        }
    });
}());