/*jslint browser: true, devel: true */
/*global $ */
var canvas,
    context,
    nodes = [],
    connections = [],
    toolState = "Move"; // "Move" || "Edit" || "Link" || "Remove"

canvas = document.getElementById("app-canvas");
canvas.width = $("#content").width();
canvas.height = $("#content").height();
context = canvas.getContext("2d");

//@TODO: Add canvas |& context & nodes to param list to make function more modular
function draw () {
    var nodeIndex,
        currentNode,
        fontSize = 10,
        padding = 5,
        margin = 10;

    canvas.width = canvas.width;
    context.font = brianbrewer.NodeStyle.FontSize + "px " + brianbrewer.NodeStyle.FontFamily;

    //@TODO: Complete section and find a more cost effective drawing sequence, redraw sections of the screen
    //@TODO: Update the NodeStyle use with inputs, required and state
    // Draw All Nodes
    for (nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
        currentNode = nodes[nodeIndex];

        // Fill Node
        context.fillStyle = brianbrewer.NodeStyle.BackgroundColor;
        context.fillRect(currentNode.Position.X, currentNode.Position.Y, currentNode.Dimension.NodeWidth, currentNode.Dimension.NodeHeight);

        // Fill Title
        context.fillStyle = brianbrewer.NodeStyle.TitleBackgroundColor;
        context.fillRect(currentNode.Position.X, currentNode.Position.Y, currentNode.Dimension.NodeWidth, currentNode.Dimension.TitleHeight);

        // Write Title
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillStyle = brianbrewer.NodeStyle.FontColor;
        context.fillText(currentNode.Title, currentNode.Position.X + brianbrewer.NodeStyle.NodeMargin, currentNode.Position.Y + currentNode.Dimension.TitleHeight / 2);

        // Write Input
		context.beginPath();
        context.textAlign = "left";
        context.textBaseline = "middle";
        currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
        for (nodeInput in currentNode.Input) {
            currentHeight += brianbrewer.NodeStyle.NodePadding;
            context.fillText(nodeInput + " (" + currentNode.Input[nodeInput].Type + ")", currentNode.Position.X + brianbrewer.NodeStyle.NodeMargin, currentNode.Position.Y + currentHeight);
            currentHeight += brianbrewer.NodeStyle.FontSize;
        }

		// Write Output
		context.beginPath();
        context.textAlign = "right";
        context.textBaseline = "middle";
        currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
        for (nodeOutput in currentNode.Output) {
            currentHeight += brianbrewer.NodeStyle.NodePadding;
            context.fillText(nodeOutput + " (" + currentNode.Output[nodeOutput].Data.Type + ")", currentNode.Position.X + currentNode.Dimension.NodeWidth - brianbrewer.NodeStyle.NodeMargin, currentNode.Position.Y + currentHeight);
            currentHeight += brianbrewer.NodeStyle.FontSize;
		}

        // Draw Input Points
        currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
        for (nodeInput in currentNode.Input) {
			context.beginPath();
			context.fillStyle = brianbrewer.NodeStyle.InputColor[currentNode.Input[nodeInput].State];
            currentHeight += brianbrewer.NodeStyle.NodePadding;
            context.arc(currentNode.Position.X, currentNode.Position.Y + currentHeight, 5, 0, Math.PI * 2, false);
			currentHeight += brianbrewer.NodeStyle.FontSize;
			context.fill();
        }

        // Draw Output Points
        currentHeight = currentNode.Dimension.TitleHeight + brianbrewer.NodeStyle.NodePadding;
        for (nodeOutput in currentNode.Output) {
            context.beginPath();
            context.fillStyle = brianbrewer.NodeStyle.OutputColor[currentNode.Output[nodeOutput].State];
            currentHeight += brianbrewer.NodeStyle.NodePadding;
            context.arc(currentNode.Position.X + currentNode.Dimension.NodeWidth, currentNode.Position.Y + currentHeight, 5, 0 ,Math.PI * 2, false);
            currentHeight += brianbrewer.NodeStyle.FontSize;
            context.fill();
		}

        // Draw Preview Window
        context.beginPath();
        context.fillStyle = "#fff"; //@TODO: Substitute for actual image
        context.fillRect(currentNode.Position.X + currentNode.Dimension.PreviewX, currentNode.Position.Y + currentNode.Dimension.PreviewY, 100, 100);
    }

    // Draw All Connections
    for (var i = 0; i < connections.length; i++) {
    }
}

// Test adding new Node
$(".tool").on("click", function () {
    nodes.push(new brianbrewer.Nodes.Triangle(100, 100));
    draw();
});

// UI JavaScript
var snapper = new Snap({
    element: document.getElementById('content'),
    disable: 'none',
    hyperextensible: false,
    touchToDrag: false,
    maxPosition: 200,
    minPosition: -200
});

$(".open-left").on("click", function () {
    if (snapper.state().state == "left") {
        snapper.close();
    } else {
        snapper.open("left");
    }
});

$(".open-right").on("click", function () {
    if (snapper.state().state == "right") {
        snapper.close();
    } else {
        snapper.open("right");
    }
});

// Toolbox Collapsing
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

    toolState = $(tElement).data("mode");
});

function openDialog() {
    vex.dialog.open({
        message: "Edit Dialog"
    });
}

function connectInputOutput (InputNode, InputName, OutputNode, OutputName) {
    // Check Input -> Output Type
    if (InputNode.Input[InputName].Type === OutputNode.Output[OutputName].Data.Type) {
        InputNode.Input[InputName].Data = OutputNode.Output[OutputName].Data;
        InputNode.Input[InputName].State = "Connected";
        OutputNode.Output[OutputName].State = "Connected";
    } else {
        InputNode.Input[InputName].State = "Problem";
        OutputNode.Output[OutputName].State = "Connected";
    }
}

function disconnectInputOutput (InputNode, InputName, OutputNode, OutputName) {
    // Remove Regardless
    InputNode.Input[InputName].Data = null;
    InputNode.Input[InputName].State = "Optional";
    OutputNode.Output[OutputName].State = "Disconnected";
}

canvas.addEventListener("mousedown", canvasDown);
canvas.addEventListener("mouseup", canvasUp);

var canvasOffsetX,
    canvasOffsetY,
    canvasID;

function canvasDown (e) {
    // Moving Nodes
    if (toolState === "Move") {
        canvasX = e.clientX + (snapper.state().state == "left" ? -200 : 0) + (snapper.state().state == "right" ? 200 : 0);
        canvasY = e.clientY;

        //@FUTURE Maybe search backwards to find newest first
        for (i = nodes.length - 1; i >= 0; i--) {
            if (canvasX > nodes[i].Position.X && canvasX < nodes[i].Position.X + nodes[i].Dimension.NodeWidth && canvasY > nodes[i].Position.Y && canvasY < nodes[i].Position.Y + nodes[i].Dimension.NodeHeight) {
                canvasOffsetX = canvasX - nodes[i].Position.X;
                canvasOffsetY = canvasY - nodes[i].Position.Y;
                canvasID = i;
                canvas.addEventListener("mousemove", canvasMove);
                break;
            }
        }
    }

    // Link Nodes Input / Output
    if (toolState === "Link") {
    }

    // Edit
    if (toolState === "Link") {
    }

    // Remove
    if (toolState === "Remove") {
    }
}

function canvasMove (e) {
    // Moving Nodes
    if (toolState === "Move") {
        canvasX = e.clientX + (snapper.state().state == "left" ? -200 : 0) + (snapper.state().state == "right" ? 200 : 0);
        canvasY = e.clientY;

        nodes[canvasID].Position.X = canvasX - canvasOffsetX;
        nodes[canvasID].Position.Y = canvasY - canvasOffsetY;

        draw();
    }
}

function canvasUp (e) {
    // Moving Nodes
    if (toolState === "Move") {
        canvas.removeEventListener("mousemove", canvasMove);
    }
}