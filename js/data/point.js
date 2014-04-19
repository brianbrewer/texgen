/*global brianbrewer */

(function () {
    "use strict";

    // Vectors / Points (X, Y)
    brianbrewer.Data.Point = brianbrewer.Data.GData.extend({
        init: function (x, y, editable) {
            this.sup(editable);

            this.X = x;
            this.Y = y;

            this.Type = "Point";

            this.EditPattern = "<label for=\"%name-X\">%name X</label><input name=\"%name-X\" type=\"number\" value=\"%data-X\">" +
                "<label for=\"%name-Y\">%name Y</label><input name=\"%name-Y\" type=\"number\" value=\"%data-Y\">";
            this.MergePattern = {
                X: "%name-X",
                Y: "%name-Y"
            };
        }
    });
}());
