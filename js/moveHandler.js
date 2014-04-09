/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer, alertify */

var brianbrewer = brianbrewer || {};
brianbrewer.Handler = brianbrewer.Handler || {};

(function () {
    "use strict";
    var offsetX,
        offsetY,
        currentNode;

    brianbrewer.Handler.MoveStart = function (e) {
        var i,
            mouseX,
            mouseY,
            Nodes,
            canvasOffset,
            snapObject;

        // Setup variables
        Nodes = brianbrewer.Interface.Nodes;
        canvasOffset = brianbrewer.Interface.CanvasOffset;
        snapObject = brianbrewer.Interface.getSnapObject();

        // Calculate the current mouse X and Y offset
        mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
        mouseY = -canvasOffset.Y + e.clientY - 45;

        // Find a node (if any) selected by the user
        for (i = Nodes.length - 1; i >= 0; i -= 1) {
            if (mouseX > Nodes[i].Position.X && mouseX < Nodes[i].Position.X + Nodes[i].Dimension.NodeWidth && mouseY > Nodes[i].Position.Y && mouseY < Nodes[i].Position.Y + Nodes[i].Dimension.NodeHeight) {
                offsetX = mouseX - Nodes[i].Position.X;
                offsetY = mouseY - Nodes[i].Position.Y;
                currentNode = i;

                // Node found, end immediately
                return true;
            }
        }
    };

    brianbrewer.Handler.MoveDuring = function (e) {
        // Update position of Node
        var Nodes,
            mouseX,
            mouseY,
            canvasOffset,
            snapObject;

        // Setup variables
        Nodes = brianbrewer.Interface.Nodes;

        // Quickly check to see if there is a point in continuing
        if (Nodes[currentNode]) {
            canvasOffset = brianbrewer.Interface.CanvasOffset;
            snapObject = brianbrewer.Interface.getSnapObject();

            mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
            mouseY = -canvasOffset.Y + e.clientY - 45;

            Nodes[currentNode].Position.X = mouseX - offsetX;
            Nodes[currentNode].Position.Y = mouseY - offsetY;
        }
    };

    brianbrewer.Handler.MoveEnd = function () {
        currentNode = null;
    };
}());
