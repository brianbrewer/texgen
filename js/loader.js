/*jslint browser: true, devel: true */
/*global brianbrewer, chic, toast */
var brianbrewer = brianbrewer || {};
var Class = Class || chic.Class;

/*
 * Sets up the Nodes and Data Objects as well as the
 */
(function () {
    "use strict";

    // NameSpaces
    brianbrewer.Nodes = {};
    brianbrewer.Data = {};
    brianbrewer.Loader = {};

    // NodeStyle
    brianbrewer.NodeStyle = {
        FontSize: 10,
        FontColor: "#333",
        FontFamily: "Sans-Serif",
        LineWidth: 1,
        LineColor: "",
        FillColor: 0,
        NodePadding: 5,
        NodeMargin: 10,
        BackgroundColor: "#f0f0f0",
        TitleBackgroundColor: "#bbb",
        InputColor: {
            Required: "#ff0",
            Optional: "#fff",
            Connected: "#0f0",
            Problem: "#f00"
        },
        OutputColor: {
            Disconnected: "#bbb",
            Connected: "#0f0"
        }
    };

    brianbrewer.Input = Class.extend({
        init: function (type, required) {
            this.Data = null;
            this.Type = type;
            this.Required = required;
            this.State = "Disconnected";
        }
    });

    brianbrewer.Output = Class.extend({
        init: function (data) {
            this.Data = data;
            this.State = "Disconnected";
        }
    });

    // Load /data and /nodes
    brianbrewer.Loader.Load = function () {
        // Load Data
        toast(
            ['js/data/gdata.js', function () { return brianbrewer.Data.GData; }],
            ['js/data/point.js', function () { return brianbrewer.Data.Point; }],
            function () { console.log("Data Loaded!"); }
        );

        // Load Nodes
        toast(
            ['js/nodes/gnode.js', function () { return brianbrewer.Nodes.GNode; }],
            ['js/nodes/triangle.js', function () { return brianbrewer.Nodes.Triangle; }],
            ['js/nodes/tesselatetriangle.js', function () { return brianbrewer.Nodes.TesselateTriangle; }],
            function () { console.log("Nodes Loaded!"); }
        );
    };
}());

/*
// Object for holding all the style information
brianbrewer.NodeStyle = {
    FontSize: 10,
    FontColor: "#333",
    FontFamily: "Sans-Serif",
    LineWidth: 1,
    LineColor: "",
    FillColor: 0,
    NodePadding: 5,
    NodeMargin: 10,
    BackgroundColor: "#f0f0f0",
    TitleBackgroundColor: "#bbb",
    InputColor: {
        Required: "#ff0",
        Optional: "#fff",
        Connected: "#0f0",
        Problem: "#f00"
    },
    OutputColor: {
        Disconnected: "#bbb",
        Connected: "#0f0"
    }
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
        this.Predecessor = [];
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
        this.Dimension.NodeWidth = 150;
        this.Dimension.PreviewWidth = 100;
        this.Dimension.PreviewHeight = 100;

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
        this.Dimension.NodeHeight = this.Dimension.TitleHeight + this.Dimension.InputOutputHeight + this.Dimension.PreviewHeight + NodeStyle.NodePadding * 2;
        this.Dimension.PreviewX = (this.Dimension.NodeWidth - this.Dimension.PreviewWidth) / 2;
        this.Dimension.PreviewY = this.Dimension.TitleHeight + this.Dimension.InputOutputHeight
    }
});

// Node for editing and drawing Single Shapes (3 -> 4 Sides)
var ShapeNode = GNode.extend({
    init: function (x, y) {
        this.sup(x, y, "Shape Node");

        // Outputs
        this.Output.Point1 = new Output(new PointData(0, 0));
        this.Output.Point2 = new Output(new PointData(0, 0));
        this.Output.Point3 = new Output(new PointData(0, 0));
        this.Output.Point4 = new Output(new PointData(0, 0));

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
        this.Input.Point1 = new Input("Point", true);
        this.Input.Point2 = new Input("Point", true);
        this.Input.Point3 = new Input("Point", true);
        this.Input.Point4 = new Input("Point", false);

        // Values
        this.PointCount = 3;

        // Final
        this.CalculateSize();
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
    init: function (i) {
    }
});

// Stores RGB as a Nested Array
var ColorDataData = GData.extend({
});

var Input = Class.extend({
    init: function (type, required) {
        this.Data = null;
        this.Type = type;
        this.Required = required;
        this.State = "Disconnected";
    }
});

var Output = Class.extend({
    init: function (data) {
        this.Data = data;
        this.State = "Disconnected";
    }
});
*/
