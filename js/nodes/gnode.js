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
            this.Predecessor = [];
            this.Category = "Unsorted";

            // Canvas for drawing / preview
            this.ComputeCanvas = document.createElement("canvas");
            this.ComputeCanvas.width = brianbrewer.Options.renderWidth;
            this.ComputeCanvas.height = brianbrewer.Options.renderHeight;

            // Working with chic means assigning id's to things is a little finicky
            if (typeof x !== "undefined") {
                this.ID = brianbrewer.getNodeID();
            }
        },
        Rename: function (newName) {
            this.Title = newName;
        },
        addPredecessor: function (node) {
            var i;

            for (i = 0; i < this.Predecessor.length; i += 1) {
                if (this.Predecessor[i].ID === node.ID) {
                    return;
                }
            }

            this.Predecessor.push(node);
        },
        removePredecessor: function (node) {
            var i;

            for (i = 0; i < this.Predecessor.length; i += 1) {
                if (this.Predecessor[i].ID === node.ID) {
                    this.Predecessor.splice(i, 1);
                    break;
                }
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
            this.Dimension.NodeWidth = 200;
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

            for (i = 0; i < this.Predecessor.length; i += 1) {
                this.Predecessor[i].Compute();
            }

            console.log("Render :: " + this.Title);
        }
    });
}());

/* Nodes !!!!!!
    <ul class="toolbox">
        <li class="heading" data-heading="basic"><i class="fa fa-caret-down"></i> Basic</li>
        <ul id="group-basic">
            <li class="tool">Triangle</li>
            <li class="tool">Quadrilateral</li>
            <li class="tool">Point (Vector)</li>
            <li class="tool">Matrix</li>
            <li class="tool">Integer</li>
        </ul>
        <li class="heading" data-heading="tesselate"><i class="fa fa-caret-down"></i> Tesselate</li>
        <ul id="group-tesselate">
            <li class="tool">Square</li>
            <li class="tool">Rectangle</li>
            <li class="tool">Regular Triangle</li>
            <li class="tool">Regular Hexagon</li>
            <li class="tool">Arbritrary Triangle</li>
            <li class="tool">Arbritrary Quadrilateral</li>
        </ul>
        <li class="heading" data-heading="generate"><i class="fa fa-caret-down"></i> Generate</li>
        <ul id="group-generate">
            <li class="tool">Perlin Noise</li>
            <li class="tool">Simplex Noise</li>
            <li class="tool">Fractional Brownian Noise</li>
        </ul>
        <li class="heading" data-heading="function"><i class="fa fa-caret-down"></i> Function</li>
        <ul id="group-function">
            <li class="tool">Inverse</li>
            <li class="tool">Fill</li>
            <li class="tool">Dilate</li>
            <li class="tool">Contract</li>
            <li class="tool">Import Image</li>
            <li class="tool">Color Replace</li>
            <li class="tool">Checkerboard</li>
            <li class="tool">Mask</li>
        </ul>
        <li class="heading" data-heading="converter"><i class="fa fa-caret-down"></i> Converter</li>
        <ul id="group-converter">
            <li class="tool">Point</li>
            <li class="tool">Shape</li>
            <li class="tool">Integer</li>
        </ul>
    </ul>
 */
