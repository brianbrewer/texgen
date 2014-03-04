var canvas,
    context,
    nodes = [];

canvas = document.getElementById("app-canvas");
canvas.width = $(".navbar-default").width();
canvas.height = $(".snap-content").height();
context = canvas.getContext("2d");

function draw() {
    var nodeIndex,
        currentNode,
        fontSize = 10,
        padding = 5,
        margin = 10;

    context.strokeStyle = "#333";
    context.fillStyle = "#777";
    canvas.width = canvas.width;

    // // Example Node Drawing Code
    // for (nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
    //     currentNode = nodes[nodeIndex];

    //     // Fill Node Box
    //     context.fillStyle = "#bbb";
    //     context.fillRect(currentNode.x, currentNode.y, 130 + margin * 2, 300);

    //     // Draw Node Box
    //     context.rect(currentNode.x, currentNode.y, 130 + margin * 2, 300);

    //     // Draw Title Box
    //     context.fillStyle = "#ccc";
    //     context.fillRect(currentNode.x, currentNode.y, 130 + margin * 2, padding * 2 + fontSize);
    //     context.rect(currentNode.x, currentNode.y, 130 + margin * 2, padding * 2 + fontSize);

    //     // Draw Title of Node
    //     context.textAlign = "left";
    //     context.textBaseline = "middle";
    //     context.fillStyle = "#000";
    //     context.fillText(currentNode.name, currentNode.x + 10, currentNode.y + 10);

    //     // Draw Inputs
    //     for (i = 0; i < currentNode.inputs.length; i++) {
    //         context.fillText(currentNode.inputs[i], currentNode.x + margin, currentNode.y + padding * 4 + fontSize * 1.5 + padding * (i * 2) + fontSize * i);
    //     }

    //     // Draw Preview Box
    //     context.fillStyle = "#fff";
    //     context.fillRect(currentNode.x + margin, currentNode.y + padding * 4 + fontSize * 1.5 + padding * (currentNode.inputs.length * 2) + fontSize * currentNode.inputs.length, 130, 130);
    //     context.rect(currentNode.x + margin, currentNode.y + padding * 4 + fontSize * 1.5 + padding * (currentNode.inputs.length * 2) + fontSize * currentNode.inputs.length, 130, 130);
    // }
    // context.stroke();

    // New Drawing
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

        // Write Input / Output
        currentHeight = currentNode.Dimension.TitleHeight + NodeStyle.NodePadding;

        for (nodeInput in currentNode.Input) {
            currentHeight += NodeStyle.NodePadding;
            context.fillText(currentNode.Input[nodeInput].Type, currentNode.Position.X + NodeStyle.NodeMargin, currentNode.Position.Y + currentHeight);
            currentHeight += NodeStyle.FontSize;
        }

        currentInput = 0;
        for (nodeOutput in currentNode.Outputs) {
        }
        //@TODO: Finish this

        // Draw Input / Output Points
        // Draw Circle!
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