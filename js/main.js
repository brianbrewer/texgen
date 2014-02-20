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

	// Example Node Drawing Code
	for (nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
		currentNode = nodes[nodeIndex];

		// Fill Node Box
		context.fillStyle = "#bbb";
		context.fillRect(currentNode.x, currentNode.y, 130 + margin * 2, 300);

		// Draw Node Box
		context.rect(currentNode.x, currentNode.y, 130 + margin * 2, 300);

		// Draw Title Box
		context.fillStyle = "#ccc";
		context.fillRect(currentNode.x, currentNode.y, 130 + margin * 2, padding * 2 + fontSize);
		context.rect(currentNode.x, currentNode.y, 130 + margin * 2, padding * 2 + fontSize);

		// Draw Title of Node
		context.textAlign = "left";
		context.textBaseline = "middle";
		context.fillStyle = "#000";
		context.fillText(currentNode.name, currentNode.x + 10, currentNode.y + 10);

		// Draw Inputs
		for (i = 0; i < currentNode.inputs.length; i++) {
			context.fillText(currentNode.inputs[i], currentNode.x + margin, currentNode.y + padding * 4 + fontSize * 1.5 + padding * (i * 2) + fontSize * i);
		}

		// Draw Preview Box
		context.fillStyle = "#fff";
		context.fillRect(currentNode.x + margin, currentNode.y + padding * 4 + fontSize * 1.5 + padding * (currentNode.inputs.length * 2) + fontSize * currentNode.inputs.length, 130, 130);
		context.rect(currentNode.x + margin, currentNode.y + padding * 4 + fontSize * 1.5 + padding * (currentNode.inputs.length * 2) + fontSize * currentNode.inputs.length, 130, 130);
	}
	context.stroke();
}

$(".list-group-item").on("click", function () {
	nodes.push(newNode());
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
		if (canvasX > nodes[i].x && canvasX < nodes[i].x + 150 && canvasY > nodes[i].y && canvasY < nodes[i].y + 300) {
			canvasOffsetX = canvasX - nodes[i].x;
			canvasOffsetY = canvasY - nodes[i].y;
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

	nodes[canvasID].x = canvasX - canvasOffsetX;
	nodes[canvasID].y = canvasY - canvasOffsetY;

	draw();
}

function canvasUp (e) {
	canvas.removeEventListener("mousemove", canvasMove);
}