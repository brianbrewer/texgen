/*global brianbrewer */
//@TODO: Fix this
(function () {
    "use strict";

    // Image Data for passing images
    brianbrewer.Data.Colour = brianbrewer.Data.GData.extend({
        init: function (colour, editable) {
            var hexToR,
                hexToG,
                hexToB,
                cutHex;

            this.sup(editable);

            this.Hex = colour || "";

            this.Type = "Colour";

            this.EditPattern = "<label for=\"%name-Hex\">Colour</label><input name=\"%name-Hex\" type=\"color\" value=\"%data-Hex\">";
            this.MergePattern = {
                Hex: "%name-Hex"
            };
        }
    });
}());
