/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer, alertify, Math */

var brianbrewer = brianbrewer || {};
brianbrewer.Handler = brianbrewer.Handler || {};

(function () {
    "use strict";
    var currentLink = {
            Type: "",
            Data: null,
            Node: null
        };

    brianbrewer.Handler.LinkStart = function (e) {
        var i,
            j,
            Nodes,
            Canvas,
            currentNode,
            currentHeight,
            nodeInput,
            nodeOutput,
            mouseX,
            mouseY,
            canvasOffset,
            snapObject,
            Connections,
            currentConnection;

        // Grab variables
        canvasOffset = brianbrewer.Interface.CanvasOffset;
        snapObject = brianbrewer.Interface.getSnapObject();
        Connections = brianbrewer.Interface.Connections;
        Nodes = brianbrewer.Interface.Nodes;
        Canvas = brianbrewer.Interface.Canvas;
        currentConnection = brianbrewer.Interface.CurrentConnection;

        mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
        mouseY = -canvasOffset.Y + e.clientY - 45;

        // Link Input <--> Outputs
        for (i = 0; i < Nodes.length; i += 1) {
            currentNode = Nodes[i];

            // Check against inputs
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeInput in currentNode.Input) {
                if (currentNode.Input.hasOwnProperty(nodeInput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;

                    if (Math.sqrt(Math.pow(mouseX - (currentNode.Position.X), 2) + Math.pow(mouseY - (currentNode.Position.Y + currentHeight), 2)) < 5) {

                        // Check if there is already an existing connection
                        for (j = 0; j < Connections.length; j += 1) {
                            // Disconnect everything and remove from connections drawing list
                            if (Connections[j].InputNode.ID === currentNode.ID && Connections[j].InputData === nodeInput) {
                                Connections[j].InputNode.Input[Connections[j].InputData].Connected = false;
                                Connections[j].OutputNode.Output[Connections[j].OutputData].Connected = false;
                                Connections.splice(j, 1);
                            }
                        }

                        currentLink.Type = "Input";
                        currentLink.Node = Nodes[i];
                        currentLink.Data = nodeInput;

                        currentConnection.x1 = currentNode.Position.X;
                        currentConnection.y1 = currentNode.Position.Y + currentHeight;
                        currentConnection.x2 = mouseX;
                        currentConnection.y2 = mouseY;

                        // Node link point found, everything setup, end immediately
                        return true;
                    }
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }

            // Check against outputs
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeOutput in currentNode.Output) {
                if (currentNode.Output.hasOwnProperty(nodeOutput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;

                    if (Math.sqrt(Math.pow(mouseX - (currentNode.Position.X + currentNode.Dimension.NodeWidth), 2) + Math.pow(mouseY - (currentNode.Position.Y + currentHeight), 2)) < 5) {

                        // Check if there is already an existing connection
                        for (j = 0; j < Connections.length; j += 1) {
                            // Disconnect everything and remove from connections drawing list
                            if (Connections[j].OutputNode.ID === currentNode.ID && Connections[j].OutputData === nodeOutput) {
                                Connections[j].InputNode.Input[Connections[j].InputData].Connected = false;
                                Connections[j].OutputNode.Output[Connections[j].OutputData].Connected = false;
                                Connections.splice(j, 1);
                            }
                        }

                        currentLink.Type = "Output";
                        currentLink.Node = Nodes[i];
                        currentLink.Data = nodeOutput;

                        currentConnection.x1 = currentNode.Position.X + currentNode.Dimension.NodeWidth;
                        currentConnection.y1 = currentNode.Position.Y + currentHeight;
                        currentConnection.x2 = currentConnection.x1;
                        currentConnection.y2 = currentConnection.y1;

                        // Node link point found, everything setup, end immediately
                        return true;
                    }
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }
        }
    };

    brianbrewer.Handler.LinkDuring = function (e) {
        var mouseX,
            mouseY,
            canvasOffset,
            snapObject,
            currentConnection;

        // Draw line from nodes to mouse
        canvasOffset = brianbrewer.Interface.CanvasOffset;
        snapObject = brianbrewer.Interface.getSnapObject();
        currentConnection = brianbrewer.Interface.CurrentConnection;

        mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
        mouseY = -canvasOffset.Y + e.clientY - 45;

        currentConnection.x2 = mouseX;
        currentConnection.y2 = mouseY;
    };

    brianbrewer.Handler.LinkEnd = function (e) {
        var i,
            j,
            currentNode,
            Nodes,
            currentHeight,
            nodeInput,
            mouseX,
            mouseY,
            Connections,
            nodeOutput,
            snapObject,
            Canvas,
            canvasOffset,
            currentConnection;

        // Setup variables
        canvasOffset = brianbrewer.Interface.CanvasOffset;
        snapObject = brianbrewer.Interface.getSnapObject();
        Connections = brianbrewer.Interface.Connections;
        Nodes = brianbrewer.Interface.Nodes;
        Canvas = brianbrewer.Interface.Canvas;
        currentConnection = brianbrewer.Interface.CurrentConnection;

        mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
        mouseY = -canvasOffset.Y + e.clientY - 45;

        // Confirm link between nodes
        for (i = 0; i < Nodes.length; i += 1) {
            currentNode = Nodes[i];

            // Check against inputs
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeInput in currentNode.Input) {
                if (currentNode.Input.hasOwnProperty(nodeInput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;

                    // If distance from center of point to mouseXY is less than 5
                    if (Math.sqrt(Math.pow(mouseX - (currentNode.Position.X), 2) + Math.pow(mouseY - (currentNode.Position.Y + currentHeight), 2)) < 5) {

                        // Check if there is already an existing connection
                        for (j = 0; j < Connections.length; j += 1) {
                            // Disconnect everything and remove from connections drawing list
                            if (Connections[j].InputNode.ID === currentNode.ID && Connections[j].InputData === nodeInput) {
                                Connections[j].InputNode.Input[Connections[j].InputData].Connected = false;
                                Connections[j].OutputNode.Output[Connections[j].OutputData].Connected = false;
                                Connections.splice(j, 1);
                            }
                        }

                        // Check if the types match up
                        if (currentLink.Type === "Output" && currentNode.Input[nodeInput].Type === currentLink.Node.Output[currentLink.Data].Data.Type) {
                            // Setup the connection between the two
                            currentNode.Input[nodeInput].Data = currentLink.Node.Output[currentLink.Data].Data;
                            currentNode.Input[nodeInput].Connected = true;
                            currentLink.Node.Output[currentLink.Data].Connected = true;
                            Connections.push({
                                InputNode: currentNode,
                                InputData: nodeInput,
                                OutputNode: currentLink.Node,
                                OutputData: currentLink.Data
                            });

                            // Add predecessor for rendering
                            currentLink.Node.addPredecessor(currentNode);
                        }
                        break;
                    }
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }

            // Check against outputs
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeOutput in currentNode.Output) {
                if (currentNode.Output.hasOwnProperty(nodeOutput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;

                    // If distance from center of point to mouseXY is less than 5
                    if (Math.sqrt(Math.pow(mouseX - (currentNode.Position.X + currentNode.Dimension.NodeWidth), 2) + Math.pow(mouseY - (currentNode.Position.Y + currentHeight), 2)) < 5) {
                        // Check if there is already an existing connection
                        for (j = 0; j < Connections.length; j += 1) {
                            // Disconnect everything and remove from connections drawing list
                            if (Connections[j].OutputNode.ID === currentNode.ID && Connections[j].OutputData === nodeOutput) {
                                Connections[j].InputNode.Input[Connections[j].InputData].Connected = false;
                                Connections[j].OutputNode.Output[Connections[j].OutputData].Connected = false;
                                Connections.splice(j, 1);
                            }
                        }

                        // Check if the types match up
                        if (currentLink.Type === "Input" && currentNode.Output[nodeOutput].Data.Type === currentLink.Node.Input[currentLink.Data].Type) {
                            // Setup the connection between the two
                            currentLink.Node.Input[currentLink.Data].Data = currentNode.Output[nodeOutput].Data;
                            currentLink.Node.Input[currentLink.Data].Connected = true;
                            currentNode.Output[nodeOutput].Connected = true;
                            Connections.push({
                                InputNode: currentLink.Node,
                                InputData: currentLink.Data,
                                OutputNode: currentNode,
                                OutputData: nodeOutput
                            });

                            // Add predecessor for rendering
                            currentNode.addPredecessor(currentLink.Node);
                        }
                        break;
                    }
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }
        }

        // Reset current connection
        currentConnection.x1 = 0;
        currentConnection.y1 = 0;
        currentConnection.x2 = 0;
        currentConnection.y2 = 0;
    };
}());