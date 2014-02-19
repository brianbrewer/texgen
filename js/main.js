var canvas,
	context,
	nodes = [];

canvas = document.getElementById("app-canvas");
canvas.width = $(".navbar-default").width();
canvas.height = $(".snap-content").height();
context = canvas.getContext("2d");

function draw () {
	var nodeIndex;

	context.strokeStyle = "#333";

	for (nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
		context.rect(nodes[nodeIndex].x, nodes[nodeIndex].y, 200, 100);
	}
	context.stroke();
}

$(".list-group-item").on("click", function () {
	nodes.push({
		x: Math.round(Math.random()*800),
		y: Math.round(Math.random()*800)
	});
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