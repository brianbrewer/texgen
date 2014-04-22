/*global brianbrewer */

(function () {
    "use strict";

    // For passing integers
    brianbrewer.Data.Integer = brianbrewer.Data.GData.extend({
        init: function (i, editable) {
            this.sup(editable);

            this.Value = i;

            this.Type = "Integer";

            this.EditPattern = "<label for=\"%name\">Value</label><input name=\"%name\" type=\"number\" value=\"%data-Value\">";
            this.MergePattern = {
                Value: "%name"
            };
        }
    });
}());
