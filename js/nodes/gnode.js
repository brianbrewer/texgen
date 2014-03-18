/*jslint browser: true, devel: true */
/*global brianbrewer, Class */

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
            this.ImageData = null;
            this.Category = "Unsorted";
        },
        Rename: function (newName) {
            this.Title = newName;
        },
        setPredecessor: function (node, outputname) {
            //@TODO: Finish this
            if (node.Output[outputname]) {
                console.log("Well, it's there!");
            }
        },
        CalculateSize: function () {
            var inputHeight = 0,
                outputHeight = 0,
                output,
                input,
                shortTitle,
                isShortened = false;

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

            // If title is too long, just put some ... in there
            shortTitle = this.Title;
            while (brianbrewer.NodeStyle.NodeMargin * 2 + brianbrewer.Interface.Context.App.measureText(shortTitle + "...").width > this.Dimension.NodeWidth) {
                shortTitle = shortTitle.substr(0, shortTitle.length - 2);
                isShortened = true;
            }

            // Dynamic Values
            this.ShortTitle = isShortened ? shortTitle + "..." : this.Title;
            this.Dimension.TitleHeight = brianbrewer.NodeStyle.FontSize + brianbrewer.NodeStyle.NodePadding * 2;
            this.Dimension.InputHeight = inputHeight;
            this.Dimension.OutputHeight = outputHeight;
            this.Dimension.InputOutputHeight = inputHeight > outputHeight ? inputHeight : outputHeight;
            this.Dimension.NodeHeight = this.Dimension.TitleHeight + this.Dimension.InputOutputHeight + this.Dimension.PreviewHeight + brianbrewer.NodeStyle.NodePadding * 2;
            this.Dimension.PreviewX = (this.Dimension.NodeWidth - this.Dimension.PreviewWidth) / 2;
            this.Dimension.PreviewY = this.Dimension.TitleHeight + this.Dimension.InputOutputHeight;
        },
        Compute: function () {
            var i;
            //@TODO: Use this for the main computation of the node

            //@TODO: Stop loops >.<
            for (i = 0; i < this.Predecessor.length; i += 1) {
                this.Predecessor[i].Compute();
            }
        }
    });
}());