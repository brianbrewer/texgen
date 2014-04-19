/*global brianbrewer */

(function () {
    "use strict";

    // Image Data for passing images
    brianbrewer.Data.ImageData = brianbrewer.Data.GData.extend({
        init: function (editable) {
            this.sup(false);

            this.Image = [];

            this.Type = "ImageData";
        }
    });
}());
