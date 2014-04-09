/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer, alertify */

var brianbrewer = brianbrewer || {};
brianbrewer.Handler = brianbrewer.Handler || {};

(function () {
    "use strict";
    var offsetX,
        offsetY;

    brianbrewer.Handler.PanStart = function (e) {
        offsetX = e.clientX;
        offsetY = e.clientY;

        return true;
    };

    brianbrewer.Handler.PanDuring = function (e) {
        brianbrewer.Interface.CanvasOffset.X += e.clientX - offsetX;
        brianbrewer.Interface.CanvasOffset.Y += e.clientY - offsetY;

        offsetX = e.clientX;
        offsetY = e.clientY;
    };

    brianbrewer.Handler.PanEnd = function (e) {
        brianbrewer.Interface.CanvasOffset.X += e.clientX - offsetX;
        brianbrewer.Interface.CanvasOffset.Y += e.clientY - offsetY;
    };
}());