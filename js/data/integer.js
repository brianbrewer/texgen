/*global brianbrewer */

(function () {
    "use strict";

    // Base Graphical Data Node
    brianbrewer.Data.Integer = brianbrewer.Data.GData.extend({
        init: function (i, editable) {
            this.sup(editable);

            this.I = i;

            this.Type = "Integer";
        }
    });
}());