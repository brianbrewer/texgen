/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer, alertify, vex */

var brianbrewer = brianbrewer || {};
brianbrewer.Handler = brianbrewer.Handler || {};

(function () {
    "use strict";
    var removingNode,
        removingConnections;

    removingNode = -1;

    brianbrewer.Handler.RemoveStart = function (e) {
        var canvasOffset,
            Connections,
            messageString,
            mouseX,
            mouseY,
            Nodes,
            snapObject,
            i;

        Nodes = brianbrewer.Interface.Nodes;
        canvasOffset = brianbrewer.Interface.CanvasOffset;
        snapObject = brianbrewer.Interface.getSnapObject();
        Connections = brianbrewer.Interface.Connections;

        // Calculate the current mouse X and Y offset
        mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
        mouseY = -canvasOffset.Y + e.clientY - 45;

        // Get current node, backwards for
        for (i = Nodes.length - 1; i >= 0; i -= 1) {
            if (mouseX > Nodes[i].Position.X && mouseX < Nodes[i].Position.X + Nodes[i].Dimension.NodeWidth && mouseY > Nodes[i].Position.Y && mouseY < Nodes[i].Position.Y + Nodes[i].Dimension.NodeHeight) {
                removingNode = i;
            }
        }

        if (removingNode < 0) {
            return false;
        }

        // Craft message string
        messageString = "Remove \"" + Nodes[removingNode].Title + "\"? Includes:<br>\n";

        // Count connections into list of ids to delete
        removingConnections = [];
        for (i = 0; i < Connections.length; i += 1) {
            if (Connections[i].InputNode.ID === Nodes[removingNode].ID || Connections[i].OutputNode.ID === Nodes[removingNode].ID) {
                removingConnections.push(i);
            }
        }
        messageString += removingConnections.length + " Connections";

        vex.dialog.open({
            message: messageString,
            callback: brianbrewer.Handler.RemoveEnd
        });
    };

    // Most probably unused
    brianbrewer.Handler.RemoveDuring = function () {};

    brianbrewer.Handler.RemoveEnd = function (confirm) {
        var i,
            j,
            Connections,
            delOffset,
            Nodes;

        if (confirm) {
            Connections = brianbrewer.Interface.Connections;
            Nodes = brianbrewer.Interface.Nodes;

            // Remove all connections, using offset to combat size reduction
            delOffset = 0;
            for (i = 0; i < removingConnections.length; i += 1) {
                Connections[removingConnections[i] - delOffset].InputNode.Input[Connections[removingConnections[i] - delOffset].InputData].Data = null;
                Connections[removingConnections[i] - delOffset].InputNode.Input[Connections[removingConnections[i] - delOffset].InputData].Connected = false;
                Connections[removingConnections[i] - delOffset].OutputNode.Output[Connections[removingConnections[i] - delOffset].OutputData].Connected = false;

                Connections.splice(removingConnections[i] - delOffset, 1);
                delOffset += 1;
            }

            // Remove itself from all nodes predecessor lists
            for (i = 0; i < Nodes.length; i += 1) {
                Nodes[i].removePredecessor(Nodes[removingNode]);
            }

            // Remove the node
            Nodes.splice(removingNode, 1);

            // Finally draw to show the difference
            brianbrewer.Interface.Draw();
        }

        removingNode = -1;
        removingConnections = [];
    };
}());