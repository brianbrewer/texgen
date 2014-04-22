/*global brianbrewer */

(function () {
    "use strict";

    // Image Data for passing images
    brianbrewer.Data.String = brianbrewer.Data.GData.extend({
        init: function (string, editable) {
            this.sup(editable);

            this.String = string || "";

            this.Type = "String";

            this.EditPattern = "<label for=\"%name-String\">String</label><input name=\"%name-String\" type=\"text\" value=\"%data-String\">";
            this.MergePattern = {
                String: "%name-String"
            };
        }
    });
}());
