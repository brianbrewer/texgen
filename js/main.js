var canvas,
    context,
    nodes = [];

canvas = document.getElementById("app-canvas");
canvas.width = $(".navbar-default").width();
canvas.height = $(".snap-content").height();
context = canvas.getContext("2d");

//@TODO: Add canvas |& context & nodes to param list to make function more modular
function draw() {
    var nodeIndex,
        currentNode,
        fontSize = 10,
        padding = 5,
        margin = 10;

    context.strokeStyle = "#333";
    context.fillStyle = "#777";
    canvas.width = canvas.width;

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
        context.textAlign = "left";
        context.textBaseline = "middle";
        currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;
        for (nodeInput in currentNode.Input) {
            currentHeight += NodeStyle.NodePadding;
            context.fillText(currentNode.Input[nodeInput].Type, currentNode.Position.X + NodeStyle.NodeMargin, currentNode.Position.Y + currentHeight);
            currentHeight += NodeStyle.FontSize;
        }
        
        // Write Output
        context.textAlign = "right";
        context.textBaseline = "middle";
        currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;
        for (nodeOutput in currentNode.Outputs) {
            currentHeight += NodeStyle.NodePadding;
            context.fillText(currentNode.Output[nodeOutput].Type, currentNode.Position.X + NodeStyle.NodeMargin, currentNode.Position.Y + currentHeight);
            currentHeight += NodeStyle.FontSize;
        }
        
        // Draw Input Points
        //@TODO: Set fill color to GNode.js -> NodeStyle.InputColor[currentNode.Input[nodeInput].State == Required | Optional | Filled | Error
        var cRadius, cStartAngle, cEndAngle, cCounterClockwise;
        currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;
        for (nodeInout in currentNode.Input) {
            currentHeight += NodeStyle.NodePadding;
            context.arc(currentNode.Position.X, currentNode.Position.Y + currentHeight, cRadius, cStartAngle, cEndAngle, cCounterClockwise);
        }
        context.fill();
    }
}

// Test adding new Node
$(".list-group-item").on("click", function () {
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

function openDialog() {
    $("#myModal").modal({
        show: true,
        keyboard: true
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

    // Maybe search backwards to find newest first
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
