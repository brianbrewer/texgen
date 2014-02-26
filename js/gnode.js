/* Graphic Node Design */
newNode = function() {
	return {
		inputs: ["Input 1", "Input 2", "Input 3", "Input 4", "Input 5", "Input 6"],
		outputs: ["Output 1", "Output 2"],
		name: "Node Name",
		x: 100.5,
		y: 100.5
	}
}

// Compute Sizes using Just Data
var GNode = chic.Class.extend({
	init: function () {
		this.Input = [],
		this.Output = []
	},
	render: function () {
	}
});

var ShapeNode = GNode.extend({
	init: function () {
		this.sup();
		this.input[0] = {
			val: null,
			def: {
				x: 10,
				y: 10
			},
			name: "X1, Y1"
		};
	},
	render: function () {
	}
});

var VectorInput = chic.Class.extend({
	init: function (x, y) {
		this.X = x | 0;
		this.Y = y | 0;
	}
});

var ColorInput = chic.Class.extend({
	init: function (data) {
		this.Data = [];
	}
})

var IntegerInput = chic.Class.extend({
	init: function () {
	}
})