/*global brianbrewer */

(function () {
    "use strict";

    // Image Data for passing images
    brianbrewer.Data.String = brianbrewer.Data.GData.extend({
        init: function (string, editable) {
            this.sup(editable);

            this.String = string | "";

            this.Type = "String";
        }
    });
}());
