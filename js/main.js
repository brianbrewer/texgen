var canvas,
	context,
	nodes = [];

canvas = document.getElementById("app-canvas");
canvas.width = $(".navbar-default").width();
canvas.height = $(".snap-content").height();
context = canvas.getContext("2d");

context.fillStyle = "#eee";
context.fillRect(0, 0, canvas.width, canvas.height);