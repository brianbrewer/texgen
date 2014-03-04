/* Graphic Node Design */
var newNode = function () {
    "use strict";
    return {
        inputs: ["Input 1", "Input 2", "Input 3", "Input 4", "Input 5", "Input 6"],
        outputs: ["Output 1", "Output 2"],
        name: "Node Name",
        x: 100.5,
        y: 100.5
    };
};

var Class = Class || chic.Class;

// Object for holding all the style information
var NodeStyle = {
    FontSize: 12,
    FontColor: "#FFFFFF",
    FontFamily: "Arial",
    LineWidth: 1,
    LineColor: "",
    FillColor: 0,
    NodePadding: 5,
    NodeMargin: 10,
    BackgroundColor: "#555555",
    TitleBackgroundColor: "#333333",
    InputColorRequired: "#FF0000",
    InputColorOptional: "#0000FF",
    InputColorFilled: "#00FF00"
};

// Top Level Graphical Node Class
var GNode = Class.extend({
    init: function (x, y, title) {
        this.Input = {};
        this.Output = {};
        this.Position = {
            X: x,
            Y: y
        };
        this.Title = title;
        this.Dimension = {};
    },
    Rename: function (newName) {
        this.Title = newName;
    },
    CalculateSize: function () {
        var inputHeight = 0,
            outputHeight = 0,
            output,
            input;

        // Static Values
        this.Dimension.NodeWidth = 128;

        // Calculate Private Values
        inputHeight += NodeStyle.NodePadding;
        outputHeight += NodeStyle.NodePadding;
        for (input in this.Input) {
            inputHeight += NodeStyle.NodePadding + NodeStyle.FontSize;
        }
        for (output in this.Output) {
            outputHeight += NodeStyle.NodePadding + NodeStyle.FontSize;
        }

        // Dynamic Values
        this.Dimension.TitleHeight = NodeStyle.FontSize + NodeStyle.NodePadding * 2;
        this.Dimension.InputHeight = inputHeight;
        this.Dimension.OutputHeight = outputHeight;
        this.Dimension.InputOutputHeight = inputHeight > outputHeight ? inputHeight : outputHeight;
        this.Dimension.NodeHeight = this.Dimension.TitleHeight + this.Dimension.InputOutputHeight;
    }
});

// Node for editing and drawing Single Shapes (3 -> 4 Sides)
var ShapeNode = GNode.extend({
    init: function (x, y) {
        this.sup(x, y, "Shape Node");

        // Outputs
        this.Input.Point1 = new PointData(0, 0);
        this.Input.Point2 = new PointData(0, 0);
        this.Input.Point3 = new PointData(0, 0);
        this.Input.Point4 = new PointData(0, 0);

        // Values
        this.PointCount = 3;

        // Final
        this.CalculateSize();
    }
});

// Node for tesselating shapes
var ShapeTesselateNode = GNode.extend({
    init: function (x, y) {
        this.sup(x, y, "Shape Tesselation");

        // Inputs
        this.Input.Point1 = null;
        this.Input.Point2 = null;
        this.Input.Point3 = null;
        this.Input.Point4 = null;

        // Outputs
        this.Output.ColorData = new ColorDataData();

        // Values
        this.PointCount = 3;
    }
});

// Node for single integer
var NumberNode = GNode.extend({
    init: function () {}
});

// Top Level Data Class for Input / Outputs
var GData = Class.extend({
    init: function () {
    }
});

// Data for points (2D Vector)
var PointData = GData.extend({
    init: function (x, y) {
        this.X = x;
        this.Y = y;
        this.Type = "Point";
    }
});

// Data for Integer
var NumberData = GData.extend({
});

// Stores RGB as a Nested Array
var ColorDataData = GData.extend({
});