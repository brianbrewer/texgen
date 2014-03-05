var canvas,
    context,
    nodes = [],
    toolState = "Move"; // "Move" || "Edit" || "Link" || Remove

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
    context.font = NodeStyle.FontSize + "px " + NodeStyle.FontFamily;

    // New Drawing
    //@TODO: Complete section and find a more cost effective drawing sequence, redraw sections of the screen
    for (nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
        currentNode = nodes[nodeIndex];

        // Fill Node
        context.fillStyle = NodeStyle.BackgroundColor;
        context.fillRect(currentNode.Position.X, currentNode.Position.Y, currentNode.Dimension.NodeWidth, currentNode.Dimension.NodeHeight);

        // Fill Title
        context.fillStyle = NodeStyle.TitleBackgroundColor;
        context.fillRect(currentNode.Position.X, currentNode.Position.Y, currentNode.Dimension.NodeWidth, currentNode.Dimension.TitleHeight);

        // Write Title
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillStyle = NodeStyle.FontColor;
        context.fillText(currentNode.Title, currentNode.Position.X + NodeStyle.NodeMargin, currentNode.Position.Y + currentNode.Dimension.TitleHeight / 2);

        // Write Input
		context.beginPath();
        context.textAlign = "left";
        context.textBaseline = "middle";
        currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;
        for (nodeInput in currentNode.Input) {
            currentHeight += NodeStyle.NodePadding;
            context.fillText(nodeInput + " (" + currentNode.Input[nodeInput].Type + ")", currentNode.Position.X + NodeStyle.NodeMargin, currentNode.Position.Y + currentHeight);
            currentHeight += NodeStyle.FontSize;
        }
		
		// Write Output
		context.beginPath();
        context.textAlign = "right";
        context.textBaseline = "middle";
        currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;
        for (nodeOutput in currentNode.Output) {
            currentHeight += NodeStyle.NodePadding;
            context.fillText(nodeOutput + " (" + currentNode.Output[nodeOutput].Type + ")", currentNode.Position.X + currentNode.Dimension.NodeWidth - NodeStyle.NodeMargin, currentNode.Position.Y + currentHeight);
            currentHeight += NodeStyle.FontSize;
		}

        // Draw Input Points
        currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;
        for (nodeInput in currentNode.Input) {
			context.beginPath();
			context.fillStyle = NodeStyle.InputColor[currentNode.Input[nodeInput].State];
            currentHeight += NodeStyle.NodePadding;
            context.arc(currentNode.Position.X, currentNode.Position.Y + currentHeight, 5, 0, Math.PI * 2, false);
			currentHeight += NodeStyle.FontSize;
			context.fill();
        }

		// Draw Output Points
		currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;
		for (nodeOutput in currentNode.Output) {
			context.beginPath();
			context.fillStyle = NodeStyle.OutputColor[currentNode.Output[nodeOutput].State];
			currentHeight += NodeStyle.NodePadding;
			context.arc(currentNode.Position.X + currentNode.Dimension.NodeWidth, currentNode.Position.Y + currentHeight, 5, 0 ,Math.PI * 2, false);
			currentHeight += NodeStyle.FontSize;
			context.fill();
		}

        // Draw Preview Window
        context.beginPath();
        context.fillStyle = "#fff"; //@TODO: Substitute for actual image
        context.fillRect(currentNode.Position.X + currentNode.Dimension.PreviewX, currentNode.Position.Y + currentNode.Dimension.PreviewY, 100, 100);
    }
}

// Test adding new Node
$(".tool").on("click", function () {
    nodes.push(new ShapeNode(100, 100));
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

$("#open-left").on("click", function () {
    if (snapper.state().state == "left") {
        snapper.close();
    } else {
        snapper.open("left");
    }
});

$("#open-right").on("click", function () {
    if (snapper.state().state == "right") {
        snapper.close();
    } else {
        snapper.open("right");
    }
});

$(".toolbox .heading").on("click", function (e) {
    var target, nameTarget;

    target = e.target;
    nameTarget = target.innerHTML.toLowerCase();
    nameTarget = "#group-" + nameTarget.replace(/\s/g, "-");

    $(nameTarget).slideToggle();
});

function openDialog() {
    vex.dialog.open({
        message: "Edit Dialog"
    });
}

canvas.addEventListener("mousedown", canvasDown);
canvas.addEventListener("mouseup", canvasUp);

var canvasOffsetX,
    canvasOffsetY,
    canvasID;

function canvasDown (e) {
    canvasX = e.clientX + (snapper.state().state == "left" ? -200 : 0) + (snapper.state().state == "right" ? 200 : 0);
    canvasY = e.clientY;

    //@FUTURE Maybe search backwards to find newest first
    for (i = 0; i < nodes.length; i++) {
        if (canvasX > nodes[i].Position.X && canvasX < nodes[i].Position.X + nodes[i].Dimension.NodeWidth && canvasY > nodes[i].Position.Y && canvasY < nodes[i].Position.Y + nodes[i].Dimension.NodeHeight) {
            canvasOffsetX = canvasX - nodes[i].Position.X;
            canvasOffsetY = canvasY - nodes[i].Position.Y;
            canvasID = i;
            console.log("Found 'em!");
            canvas.addEventListener("mousemove", canvasMove);
            break;
        }
    }
}

function canvasMove (e) {
    canvasX = e.clientX + (snapper.state().state == "left" ? -200 : 0) + (snapper.state().state == "right" ? 200 : 0);
    canvasY = e.clientY;

    nodes[canvasID].Position.X = canvasX - canvasOffsetX;
    nodes[canvasID].Position.Y = canvasY - canvasOffsetY;

    draw();
}

function canvasUp (e) {
    canvas.removeEventListener("mousemove", canvasMove);
}
