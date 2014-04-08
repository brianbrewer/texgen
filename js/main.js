/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer, alertify */

var brianbrewer = brianbrewer || {};

//@TODO: Save state, nodes, positions and everything else using localstorage
//@TODO: Add settings, as it's a little bare at the moment
brianbrewer.Interface = brianbrewer.Interface || (function () {
    "use strict";

    // Functions
    var initialise,
        setupSnap,
        setupToolbar,
        setupToolDrawer,
        setupCanvas,
        drawNodes,
        drawConnections,
    //Variables
        snapObject,
        Canvas = {
            App: null,
            Nodes: null,
            Connection: null
        },
        Context = {
            App: null,
            Nodes: null,
            Connection: null
        },
        Options = {
            RenderWidth: 512,
            RenderHeight: 512
        },
        Nodes = [],
        Connections = [],
        currentState = "Pan",
        currentConnection = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        },
        canvasOffset = {
            X: 0,
            Y: 0
        };

    /**
     * Description.
     */
    initialise = function () {
        setupSnap();
        setupCanvas();
        setupToolDrawer();
        setupToolbar();
    };

    /**
     * Description.
     */
    setupSnap = function () {
        // Setup sliding menu functionality
        snapObject = new Snap({
            element: document.getElementById('content'),
            disable: 'none',
            hyperextensible: false,
            touchToDrag: false,
            maxPosition: 200,
            minPosition: -200
        });

        // Slide left button functionality
        $(".open-left").on("click", function () {
            if (snapObject.state().state === "left") {
                snapObject.close();
            } else {
                snapObject.open("left");
            }
        });

        // Slide right button functionality
        $(".open-right").on("click", function () {
            if (snapObject.state().state === "right") {
                snapObject.close();
            } else {
                snapObject.open("right");
            }
        });
    };

    /*
     * Description.
     */
    setupToolbar = function () {
        // Tool / Mode Switching
        $(".nav-left a[data-mode]").on("click", function (e) {
            var tElement;

            if (e.target.nodeName === "I") {
                tElement = e.target.parentNode;
            } else {
                tElement = e.target;
            }

            $(".nav-left a").each(function () {
                $(this).removeClass("selected");
            });
            $(tElement).addClass("selected");

            currentState = $(tElement).data("mode");
        });
    };

    /*
     * Description.
     */
    setupToolDrawer = function () {
        var node,
            categoryNodes = [],
            newCategoryNode,
            newToolNode,
            categoryFound,
            i,
            newHeadingNode,
            newHeadingIcon,
            tempNode,
            tempString;

        // Create new list item for each node and add to category nodes or make new ones
        for (node in brianbrewer.Nodes) {
            if (brianbrewer.Nodes.hasOwnProperty(node) && node !== "GNode") {

                // Create temporary instance of tool to check type, category, title etc
                tempNode = new brianbrewer.Nodes[node]();

                // Create new node
                newToolNode = document.createElement("li");
                newToolNode.classList.add("tool");
                newToolNode.dataset.tool = node;
                newToolNode.innerHTML = tempNode.Title;

                // Check to see if category already exists
                categoryFound = false;
                for (i = 0; i < categoryNodes.length; i += 1) {
                    if ("group-" + tempNode.Category.toLowerCase() === categoryNodes[i].id) {
                        // Add tool to preexisting category
                        categoryNodes[i].appendChild(newToolNode);
                        categoryFound = true;
                        break;
                    }
                }

                if (!categoryFound) {
                    // Create Group and add
                    newCategoryNode = document.createElement("ul");
                    newCategoryNode.id = "group-" + tempNode.Category.toLowerCase();
                    newCategoryNode.appendChild(newToolNode);
                    categoryNodes.push(newCategoryNode);
                }
            }
        }

        // Put all the nodes in the toolbox list
        for (i = 0; i < categoryNodes.length; i += 1) {
            tempString = categoryNodes[i].id.split("-")[1];
            newHeadingNode = document.createElement("li");
            newHeadingNode.dataset.heading = tempString;
            newHeadingNode.classList.add("heading");
            newHeadingNode.innerHTML = "<i class=\"fa fa-caret-down\"></i> " + tempString.charAt(0).toUpperCase() + tempString.slice(1);

            $(".toolbox").append(newHeadingNode);
            $(".toolbox").append(categoryNodes[i]);
        }

        // Toolbox Collapsing
        //@FUTURE: Consider revising this in some way
        $(".toolbox .heading").on("click", function (e) {
            var target,
                caret;

            if (e.target.nodeName === "I") {
                target = e.target.parentNode;
            } else {
                target = e.target;
            }
            caret = target.children[0];

            if ($(caret).hasClass("fa-rotate-270")) {
                $(caret).removeClass("fa-rotate-270");
            } else {
                $(caret).addClass("fa-rotate-270");
            }

            $("#group-" + $(target).data("heading")).slideToggle();
        });

        // Object Adding Functionality
        $(".tool").on("click", function (e) {
            Nodes.push(new brianbrewer.Nodes[e.target.dataset.tool](-canvasOffset.X + 100, -canvasOffset.Y + 100));
        });
    };

    /*
     * Description.
     */
    setupCanvas = function () {
        var canvasMouseDownHandler,
            canvasMouseMoveHandler,
            canvasMouseUpHandler,
            canvasDrawLoop,
            canvasDrawHandler,
            offsetX,
            offsetY,
            currentNode,
            currentLink = {
                Type: "",
                Data: null,
                Node: null
            };

        canvasMouseDownHandler = function (e) {
            var i,
                j,
                mouseX,
                mouseY,
                currentHeight,
                nodeInput,
                nodeOutput,
                confirmDeletion;

            // Calculate the current mouse X and Y offset
            mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
            mouseY = -canvasOffset.Y + e.clientY - 45;

            // Pan Entire Canvas
            if (currentState === "Pan") {
                offsetX = e.clientX;
                offsetY = e.clientY;

                Canvas.App.addEventListener("mousemove", canvasMouseMoveHandler);
                Canvas.App.addEventListener("mouseup", canvasMouseUpHandler);

                brianbrewer.Handler.PanStart();
                canvasDrawLoop();
            }

            // Move Individual Nodes
            if (currentState === "Move") {
                for (i = Nodes.length - 1; i >= 0; i -= 1) {
                    if (mouseX > Nodes[i].Position.X && mouseX < Nodes[i].Position.X + Nodes[i].Dimension.NodeWidth && mouseY > Nodes[i].Position.Y && mouseY < Nodes[i].Position.Y + Nodes[i].Dimension.NodeHeight) {
                        offsetX = mouseX - Nodes[i].Position.X;
                        offsetY = mouseY - Nodes[i].Position.Y;
                        currentNode = i;

                        Canvas.App.addEventListener("mousemove", canvasMouseMoveHandler);
                        Canvas.App.addEventListener("mouseup", canvasMouseUpHandler);
                        canvasDrawLoop();
                        break;
                    }
                }
            }

            // Link Input <--> Outputs
            if (currentState === "Link") {
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

                                Canvas.App.addEventListener("mousemove", canvasMouseMoveHandler);
                                Canvas.App.addEventListener("mouseup", canvasMouseUpHandler);
                                canvasDrawLoop();

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

                            if (Math.sqrt(Math.pow(mouseX - (currentNode.Position.X + currentNode.Dimension.NodeWidth), 2) + Math.pow(mouseY - (currentNode.Position.Y + currentHeight), 2)) < 5) {

                                // Check if there is already an existing connection
                                for (j = 0; j < Connections.length; j += 1) {
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

                                Canvas.App.addEventListener("mousemove", canvasMouseMoveHandler);
                                Canvas.App.addEventListener("mouseup", canvasMouseUpHandler);
                                canvasDrawLoop();

                                break;
                            }
                            currentHeight += brianbrewer.NodeStyle.FontSize;
                        }
                    }
                }
            }

            // Edit
            if (currentState === "Edit") {
                console.log("Fire!");
            }

            // Remove Nodes
            //@TODO: Cleanly
            if (currentState === "Remove") {
                confirmDeletion = function (e) {
                    if (e) {
                        console.log("Removing");
                    }
                };

                for (i = Nodes.length - 1; i >= 0; i -= 1) {
                    if (mouseX > Nodes[i].Position.X && mouseX < Nodes[i].Position.X + Nodes[i].Dimension.NodeWidth && mouseY > Nodes[i].Position.Y && mouseY < Nodes[i].Position.Y + Nodes[i].Dimension.NodeHeight) {
                        alertify.confirm("Remove '" + Nodes[i].Title + "' Node and all it's connections?", confirmDeletion);
                        break;
                    }
                }
            }
        };

        canvasMouseMoveHandler = function (e) {
            var mouseX,
                mouseY;

            mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
            mouseY = -canvasOffset.Y + e.clientY - 45;

            // Increment Canvas Offset based on mouse change
            if (currentState === "Pan") {
                canvasOffset.X += e.clientX - offsetX;
                canvasOffset.Y += e.clientY - offsetY;

                offsetX = e.clientX;
                offsetY = e.clientY;
            }

            // Update position of Node
            if (currentState === "Move") {
                Nodes[currentNode].Position.X = mouseX - offsetX;
                Nodes[currentNode].Position.Y = mouseY - offsetY;
            }

            // Draw line from nodes to mouse
            if (currentState === "Link") {
                currentConnection.x2 = mouseX;
                currentConnection.y2 = mouseY;
            }

            if (currentState === "Remove") {
                return null;
            }
        };

        canvasMouseUpHandler = function (e) {
            var i,
                j,
                currentHeight,
                nodeInput,
                nodeOutput,
                mouseX,
                mouseY;

            mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
            mouseY = -canvasOffset.Y + e.clientY - 45;

            // Confirm link between nodes
            if (currentState === "Link") {
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
                                    if (Connections[j].InputNode.ID === currentNode.ID && Connections[j].InputData === nodeInput) {
                                        Connections[j].InputNode.Input[Connections[j].InputData].Connected = false;
                                        Connections[j].OutputNode.Output[Connections[j].OutputData].Connected = false;
                                        Connections.splice(j, 1);
                                    }
                                }

                                // Connect the input and output
                                if (currentLink.Type === "Output" && currentNode.Input[nodeInput].Type === currentLink.Node.Output[currentLink.Data].Data.Type) {
                                    currentNode.Input[nodeInput].Data = currentLink.Node.Output[currentLink.Data].Data;
                                    currentNode.Input[nodeInput].Connected = true;
                                    currentLink.Node.Output[currentLink.Data].Connected = true;
                                    Connections.push({
                                        InputNode: currentNode,
                                        InputData: nodeInput,
                                        OutputNode: currentLink.Node,
                                        OutputData: currentLink.Data
                                    });
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

                            if (Math.sqrt(Math.pow(mouseX - (currentNode.Position.X + currentNode.Dimension.NodeWidth), 2) + Math.pow(mouseY - (currentNode.Position.Y + currentHeight), 2)) < 5) {

                                // Check if there is already an existing connection
                                for (j = 0; j < Connections.length; j += 1) {
                                    if (Connections[j].OutputNode.ID === currentNode.ID && Connections[j].OutputData === nodeOutput) {
                                        Connections[j].InputNode.Input[Connections[j].InputData].Connected = false;
                                        Connections[j].OutputNode.Output[Connections[j].OutputData].Connected = false;
                                        Connections.splice(j, 1);
                                    }
                                }

                                if (currentLink.Type === "Input" && currentNode.Output[nodeOutput].Data.Type === currentLink.Node.Input[currentLink.Data].Type) {
                                    currentLink.Node.Input[currentLink.Data].Data = currentNode.Output[nodeOutput].Data;
                                    currentLink.Node.Input[currentLink.Data].Connected = true;
                                    currentNode.Output[nodeOutput].Connected = true;
                                    Connections.push({
                                        InputNode: currentLink.Node,
                                        InputData: currentLink.Data,
                                        OutputNode: currentNode,
                                        OutputData: nodeOutput
                                    });
                                }
                                break;
                            }
                            currentHeight += brianbrewer.NodeStyle.FontSize;
                        }
                    }
                }

                currentConnection = {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0
                };
            }

            Canvas.App.removeEventListener("mousemove", canvasMouseMoveHandler);
            Canvas.App.removeEventListener("mouseup", canvasMouseUpHandler);

            // Quickly Draw //@TODO: Move drawing to it's own function, change it at the drawloop too
            Context.App.clearRect(0, 0, Canvas.App.width, Canvas.App.height);
            drawNodes();
            drawConnections();
            Context.App.drawImage(Canvas.Nodes, 0, 0);
            Context.App.drawImage(Canvas.Connection, 0, 0);

            window.clearTimeout(canvasDrawHandler);

            currentNode = null;
        };

        canvasDrawLoop = function () {
            canvasDrawHandler = window.setTimeout(canvasDrawLoop, 1000 / 30); // 30 fps drawing
            Context.App.clearRect(0, 0, Canvas.App.width, Canvas.App.height);
            drawNodes();
            drawConnections();
            Context.App.drawImage(Canvas.Nodes, 0, 0);
            Context.App.drawImage(Canvas.Connection, 0, 0);
        };

        // Setup canvas' and contexts
        Canvas.App = document.getElementById("app-canvas");
        Context.App = Canvas.App.getContext("2d");
        Canvas.App.width = $("#content").width();
        Canvas.App.height = $("#content").height() - $(".navbar").height();

        Canvas.Nodes = document.createElement("canvas");
        Context.Nodes = Canvas.Nodes.getContext("2d");
        Canvas.Nodes.width = Canvas.App.width;
        Canvas.Nodes.height = Canvas.App.height;

        Canvas.Connection = document.createElement("canvas");
        Context.Connection = Canvas.Connection.getContext("2d");
        Canvas.Connection.width = Canvas.App.width;
        Canvas.Connection.height = Canvas.App.height;

        // Add event listener to app canvas
        Canvas.App.addEventListener("mousedown", canvasMouseDownHandler);
    };

    /*
     * Description.
     */
    drawNodes = function () {
        var nodeIndex,
            currentNode,
            currentHeight,
            nodeInput,
            nodeOutput,
            currentInput,
            currentOutput;

        // Clear canvas
        Canvas.Nodes.width = Canvas.App.width;

        // Font setup
        Context.Nodes.font = brianbrewer.NodeStyle.FontSize + "px " + brianbrewer.NodeStyle.FontFamily;

        //@TODO: Complete section and find a more cost effective drawing sequence, redraw sections of the screen
        // Draw All Nodes
        for (nodeIndex = 0; nodeIndex < Nodes.length; nodeIndex += 1) {
            currentNode = Nodes[nodeIndex];

            // Fill Node
            Context.Nodes.fillStyle = brianbrewer.NodeStyle.BackgroundColor;
            Context.Nodes.fillRect(canvasOffset.X + currentNode.Position.X, canvasOffset.Y + currentNode.Position.Y, currentNode.Dimension.NodeWidth, currentNode.Dimension.NodeHeight);

            // Fill Title
            Context.Nodes.fillStyle = brianbrewer.NodeStyle.TitleBackgroundColor;
            Context.Nodes.fillRect(canvasOffset.X + currentNode.Position.X, canvasOffset.Y + currentNode.Position.Y, currentNode.Dimension.NodeWidth, currentNode.Dimension.TitleHeight);

            // Write Title
            Context.Nodes.textAlign = "left";
            Context.Nodes.textBaseline = "middle";
            Context.Nodes.fillStyle = brianbrewer.NodeStyle.FontColor;
            Context.Nodes.fillText(currentNode.ShortTitle, canvasOffset.X + currentNode.Position.X + brianbrewer.NodeStyle.NodeMargin, canvasOffset.Y + currentNode.Position.Y + currentNode.Dimension.TitleHeight / 2);

            // Write Input
            Context.Nodes.beginPath();
            Context.Nodes.textAlign = "left";
            Context.Nodes.textBaseline = "middle";
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeInput in currentNode.Input) {
                if (currentNode.Input.hasOwnProperty(nodeInput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;
                    Context.Nodes.fillText(nodeInput + " (" + currentNode.Input[nodeInput].Type + ")", canvasOffset.X + currentNode.Position.X + brianbrewer.NodeStyle.NodeMargin, canvasOffset.Y + currentNode.Position.Y + currentHeight);
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }

            // Write Output
            Context.Nodes.beginPath();
            Context.Nodes.textAlign = "right";
            Context.Nodes.textBaseline = "middle";
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeOutput in currentNode.Output) {
                if (currentNode.Output.hasOwnProperty(nodeOutput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;
                    Context.Nodes.fillText(nodeOutput + " (" + currentNode.Output[nodeOutput].Data.Type + ")", canvasOffset.X + currentNode.Position.X + currentNode.Dimension.NodeWidth - brianbrewer.NodeStyle.NodeMargin, canvasOffset.Y + currentNode.Position.Y + currentHeight);
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }

            // Draw Input Points
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeInput in currentNode.Input) {
                if (currentNode.Input.hasOwnProperty(nodeInput)) {
                    currentInput = currentNode.Input[nodeInput];

                    Context.Nodes.beginPath();

                    // Set Colour
                    if (currentInput.Connected) {
                        Context.Nodes.fillStyle = brianbrewer.NodeStyle.InputColor.Connected;
                    } else {
                        Context.Nodes.fillStyle = currentInput.Required ? brianbrewer.NodeStyle.InputColor.Required : brianbrewer.NodeStyle.InputColor.Optional;
                    }

                    // Draw input spheres
                    currentHeight += brianbrewer.NodeStyle.NodePadding;
                    Context.Nodes.arc(canvasOffset.X + currentNode.Position.X, canvasOffset.Y + currentNode.Position.Y + currentHeight, 5, 0, Math.PI * 2, false);
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                    Context.Nodes.fill();
                }
            }

            // Draw Output Points
            currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (nodeOutput in currentNode.Output) {
                if (currentNode.Output.hasOwnProperty(nodeOutput)) {
                    currentOutput = currentNode.Output[nodeOutput];

                    Context.Nodes.beginPath();

                    // Set color
                    if (currentOutput.Connected) {
                        Context.Nodes.fillStyle = brianbrewer.NodeStyle.OutputColor.Connected;
                    } else {
                        Context.Nodes.fillStyle = brianbrewer.NodeStyle.OutputColor.Disconnected;
                    }

                    currentHeight += brianbrewer.NodeStyle.NodePadding;
                    Context.Nodes.arc(canvasOffset.X + currentNode.Position.X + currentNode.Dimension.NodeWidth, canvasOffset.Y + currentNode.Position.Y + currentHeight, 5, 0, Math.PI * 2, false);
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                    Context.Nodes.fill();
                }
            }

            // Draw Preview Window
            Context.Nodes.beginPath();
            Context.Nodes.fillStyle = "#fff"; //@TODO: Substitute for actual image
            Context.Nodes.fillRect(canvasOffset.X + currentNode.Position.X + currentNode.Dimension.PreviewX, canvasOffset.Y + currentNode.Position.Y + currentNode.Dimension.PreviewY, 100, 100);
        }
    };

    /*
     * Description.
     */
    drawConnections = function () {
        var i,
            inputNode,
            outputNode,
            inputName,
            outputName,
            currentInput,
            currentOutput,
            currentHeight,
            startX,
            startY,
            endX,
            endY;

        // Clear Entire Canvas //@TODO: Maybe make better >_>
        Canvas.Connection.width = Canvas.App.width;

        // Compute where all the inputs / outputs for the connections are
        for (i = 0; i < Connections.length; i += 1) {
            inputNode = Connections[i].InputNode;
            outputNode = Connections[i].OutputNode;
            inputName = Connections[i].InputData;
            outputName = Connections[i].OutputData;

            // Starting X and Y [Output]
            currentHeight = outputNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (currentOutput in outputNode.Output) {
                if (outputNode.Output.hasOwnProperty(currentOutput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;
                    if (currentOutput === outputName) {
                        startX = canvasOffset.X + outputNode.Position.X + outputNode.Dimension.NodeWidth;
                        startY = canvasOffset.Y + outputNode.Position.Y + currentHeight;
                        break;
                    }
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }

            // Ending X and Y [Input]
            currentHeight = inputNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
            for (currentInput in inputNode.Input) {
                if (inputNode.Input.hasOwnProperty(currentInput)) {
                    currentHeight += brianbrewer.NodeStyle.NodePadding;
                    if (currentInput === inputName) {
                        endX = canvasOffset.X + inputNode.Position.X;
                        endY = canvasOffset.Y + inputNode.Position.Y + currentHeight;
                        break;
                    }
                    currentHeight += brianbrewer.NodeStyle.FontSize;
                }
            }

            // Draw lines
            Context.Connection.moveTo(startX, startY);
            Context.Connection.lineTo(endX, endY);
        }

        // Draw the current connection during dragging
        Context.Connection.moveTo(canvasOffset.X + currentConnection.x1, canvasOffset.Y + currentConnection.y1);
        Context.Connection.lineTo(canvasOffset.X + currentConnection.x2, canvasOffset.Y + currentConnection.y2);
        Context.Connection.stroke();
    };

    return {
        Initialise: initialise,
        Options: Options,
        Canvas: Canvas,
        Context: Context,
        Connections: Connections,
        Nodes: Nodes
    };
}());

$(window).ready(brianbrewer.Loader.Load(brianbrewer.Interface.Initialise));
