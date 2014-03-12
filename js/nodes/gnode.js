/*global brianbrewer, Class */


//@TODO: Differenciate between input and output in regards to using Data, for example nodes only have outputs defined, and inputs have states of their own
//@TODO: Maybe split up into input, output and data objects for simpler use and state use

(function () {
    "use strict";

    // Base Graphical Node
    brianbrewer.Nodes.GNode = Class.extend({
        init: function (x, y, title) {
            this.Input = {};
            this.Output = {};
            this.Position = {
                X: x,
                Y: y
            };
            this.Title = title;
            this.Dimension = {};
            this.Predecessor = []; //@TODO: Test using this functionality / check the default value
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
            inputHeight += brianbrewer.NodeStyle.NodePadding;
            outputHeight += brianbrewer.NodeStyle.NodePadding;
            for (input in this.Input) {
                if (this.Input.hasOwnProperty(input)) {
                    inputHeight += brianbrewer.NodeStyle.NodePadding + brianbrewer.NodeStyle.FontSize;
                }
            }
            for (output in this.Output) {
                if (this.Output.hasOwnProperty(output)) {
                    outputHeight += brianbrewer.NodeStyle.NodePadding + brianbrewer.NodeStyle.FontSize;
                }
            }

            // Dynamic Values
            this.Dimension.TitleHeight = brianbrewer.NodeStyle.FontSize + brianbrewer.NodeStyle.NodePadding * 2;
            this.Dimension.InputHeight = inputHeight;
            this.Dimension.OutputHeight = outputHeight;
            this.Dimension.InputOutputHeight = inputHeight > outputHeight ? inputHeight : outputHeight;
            this.Dimension.NodeHeight = this.Dimension.TitleHeight + this.Dimension.InputOutputHeight + this.Dimension.PreviewHeight + brianbrewer.NodeStyle.NodePadding * 2;
            this.Dimension.PreviewX = (this.Dimension.NodeWidth - this.Dimension.PreviewWidth) / 2;
            this.Dimension.PreviewY = this.Dimension.TitleHeight + this.Dimension.InputOutputHeight;
        },
        Compute: function () {
            //@TODO: Use this for the main computation of the image
        }
    });
}());