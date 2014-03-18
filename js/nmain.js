/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer */

var brianbrewer = brianbrewer || {};

//@TODO: Save state, nodes, positions and everything else using localstorage
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
            y1: 0
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

            //@TODO Maybe use normal ? ¬_¬ Mehiunno
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
            Nodes.push(new brianbrewer.Nodes[e.target.dataset.tool](100, 100)); //@TODO: Make sure this doesn't place off screen
            console.log(Nodes); //@FIXME Remove
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
            currentNode;

        canvasMouseDownHandler = function (e) {
            var i,
                mouseX,
                mouseY,
                currentHeight,
                nodeInput,
                nodeOutput;

            // Calculate the current mouse X and Y offset
            mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
            mouseY = -canvasOffset.Y + e.clientY - 45;

            // Pan Entire Canvas
            if (currentState === "Pan") {
                offsetX = e.clientX;
                offsetY = e.clientY;

                Canvas.App.addEventListener("mousemove", canvasMouseMoveHandler);
                Canvas.App.addEventListener("mouseup", canvasMouseUpHandler);
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

            // Link Inputs
            if (currentState === "Link") {
                for (i = 0; i < Nodes.length; i += 1) {
                    currentNode = Nodes[i];

                    // Check against inputs
                    currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
                    for (nodeInput in currentNode.Input) {
                        if (currentNode.Input.hasOwnProperty(nodeInput)) {
                            currentHeight += brianbrewer.NodeStyle.NodePadding;

                            if (Math.sqrt(Math.pow(mouseX - (currentNode.Position.X), 2) + Math.pow(mouseY - (currentNode.Position.Y + currentHeight), 2)) < 5) {
                                console.log("You got yourself an input there sir!");
                                currentConnection.x1 = currentNode.Position.X;
                                currentConnection.y1 = currentNode.Position.Y + currentHeight;

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
                                console.log("You've got yourself one of those newfangled outputs sir'");
                                currentConnection.x1 = currentNode.Position.X + currentNode.Dimension.NodeWidth;
                                currentConnection.y1 = currentNode.Position.Y + currentHeight;

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

            // Draw line from
            if (currentState === "Link") {
                //@TODO: Clean up the drawing, like actually make it do things
                Context.App.moveTo(canvasOffset.X + currentConnection.x1, canvasOffset.Y + currentConnection.y1);
                Context.App.lineTo(canvasOffset.X + mouseX, canvasOffset.Y + mouseY);
                Context.App.stroke();
            }
        };

        canvasMouseUpHandler = function (e) {
            Canvas.App.removeEventListener("mousemove", canvasMouseMoveHandler);
            Canvas.App.removeEventListener("mouseup", canvasMouseUpHandler);

            drawNodes();

            window.clearTimeout(canvasDrawHandler);

            currentNode = null;
        };

        canvasDrawLoop = function () {
            canvasDrawHandler = window.setTimeout(canvasDrawLoop, 1000 / 30); // 30 fps drawing
            drawNodes();
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
            currentInput;

        //@TODO: Clear Canvas
        Canvas.Nodes.width = Canvas.App.width;

        //@TODO: Relate this to the NodeStyle and new Canvas / Context
        //Context.Nodes.font = brianbrewer.NodeStyle.FontSize + "px " + brianbrewer.NodeStyle.FontFamily;

        //@TODO: Complete section and find a more cost effective drawing sequence, redraw sections of the screen
        //@TODO: Update the NodeStyle use with inputs, required and state
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
                    if (currentInput.State === "Disconnected") { Context.Nodes.fillStyle = currentInput.Required ? brianbrewer.NodeStyle.InputColor.Required : brianbrewer.NodeStyle.InputColor.Optional; }
                    if (currentInput.State === "Connected") { Context.Nodes.fillStyle = brianbrewer.NodeStyle.InputColor.Connected; }
                    if (currentInput.State === "Problem") { Context.Nodes.fillStyle = brianbrewer.NodeStyle.InputColor.Problem; }

                    // Draw input spheres
                    Context.Nodes.fillStyle = brianbrewer.NodeStyle.InputColor[currentNode.Input[nodeInput].State];
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
                    Context.Nodes.beginPath();
                    Context.Nodes.fillStyle = brianbrewer.NodeStyle.OutputColor[currentNode.Output[nodeOutput].State];
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

        // Copy to app
        //@TODO: Fix this to have some functionality where app canvas is updated auto / only when changes made to others?
        Context.App.clearRect(0, 0, Canvas.App.width, Canvas.App.height);
        Context.App.drawImage(Canvas.Nodes, 0, 0);
    };

    /*
     * Description.
     */
    drawConnections = function () {};

    return {
        Initialise: initialise,
        Options: Options,
        Canvas: Canvas,
        Context: Context,
        drawNodes: function () { drawNodes(); }
    };
}());

$(window).ready(brianbrewer.Loader.Load(brianbrewer.Interface.Initialise));
