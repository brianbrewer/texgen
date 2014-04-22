/*global brianbrewer */

(function () {
    "use strict";

    // Image Data for passing images
    brianbrewer.Data.Colour = brianbrewer.Data.GData.extend({
        init: function (color, editable) {
            this.sup(editable);

            this.Red = 0;
            this.Green = 0;
            this.Blue = 0;

            this.Type = "Colour";
        }
    });
}());
