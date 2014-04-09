/*global brianbrewer, Class */

//@TODO: Complete
(function () {
    "use strict";

    // Base Graphical Data Node
    brianbrewer.Data.GData = Class.extend({
        init: function (editable) {
            this.Type = "Undefined";
            this.Editable = typeof editable !== "undefined" && editable;
        }
    });
}());