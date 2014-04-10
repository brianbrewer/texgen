/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer, alertify, vex */

var brianbrewer = brianbrewer || {};
brianbrewer.Handler = brianbrewer.Handler || {};

(function () {
    "use strict";
    var editingNode;

    editingNode = -1;
    brianbrewer.Handler.EditStart = function (e) {
        var i,
            Nodes,
            canvasOffset,
            snapObject,
            mouseX,
            mouseY,
            inputString,
            outputName,
            currentOutput,
            dataPatternRaw,
            dataPatternParsed,
            editableCount;

        Nodes = brianbrewer.Interface.Nodes;
        canvasOffset = brianbrewer.Interface.CanvasOffset;
        snapObject = brianbrewer.Interface.getSnapObject();

        // Calculate the current mouse X and Y offset
        mouseX = -canvasOffset.X + e.clientX + (snapObject.state().state === "left" ? -200 : 0) + (snapObject.state().state === "right" ? 200 : 0);
        mouseY = -canvasOffset.Y + e.clientY - 45;

        // Get current node, backwards for
        for (i = Nodes.length - 1; i >= 0; i -= 1) {
            if (mouseX > Nodes[i].Position.X && mouseX < Nodes[i].Position.X + Nodes[i].Dimension.NodeWidth && mouseY > Nodes[i].Position.Y && mouseY < Nodes[i].Position.Y + Nodes[i].Dimension.NodeHeight) {
                editingNode = i;
                editableCount = 0;

                //  Check to see if there are editable fields
                for (outputName in Nodes[i].Output) {
                    if (Nodes[i].Output.hasOwnProperty(outputName) && Nodes[i].Output[outputName].Data.Editable) {
                        editableCount += 1;
                        break;
                    }
                }
                if (editableCount < 1) {
                    return false;
                }
            }
        }

        // If no node was found, end immediately
        if (editingNode < 0) {
            return false;
        }

        // Function for replacing data names with values
        function getInputName(match, $1) {
            return currentOutput.Data[$1];
        }

        // Craft the input as html
        inputString = "";
        for (outputName in Nodes[editingNode].Output) {
            if (Nodes[editingNode].Output.hasOwnProperty(outputName) && Nodes[editingNode].Output[outputName].Data.Editable) {
                currentOutput = Nodes[editingNode].Output[outputName];

                // Use data pattern and replace values to create html data inputs
                dataPatternRaw = currentOutput.Data.EditPattern;

                // Replace %name with actual name
                dataPatternParsed = dataPatternRaw.replace(/\%name/g, outputName);

                // Replace %data-N with currentOutput.Data.N value
                dataPatternParsed = dataPatternParsed.replace(/\%data-([a-zA-Z]+)/gi, getInputName);

                inputString += "<div class=\"data\">" + dataPatternParsed + "</div>";
            }
        }

        // Final dialog
        vex.dialog.open({
            message: "Editing \"" + Nodes[editingNode].Title + "\"",
            input: inputString,
            callback: brianbrewer.Handler.EditEnd
        });


        // Don't need a during or end listener exposed using main.js
        return false;
    };

    // Probably not used
    brianbrewer.Handler.EditDuring = function (e) {
        return false;
    };

    brianbrewer.Handler.EditEnd = function (data) {
        var mergePatternGroup,
            mergePattern,
            outputName,
            Nodes;

        Nodes = brianbrewer.Interface.Nodes;

        // Check if the user clicked confirm
        if (data !== false) {
            // Use MergePattern to fit together data.%name-N with Node.Output.%name.Data.N
            for (outputName in Nodes[editingNode].Output) {
                // Grab the merge list from the output data item
                if (Nodes[editingNode].Output.hasOwnProperty(outputName)) {
                    mergePatternGroup = Nodes[editingNode].Output[outputName].Data.MergePattern;

                    // Go through all the rules and attach the data name from pattern with the data name from pattern
                    for (mergePattern in mergePatternGroup) {
                        if (mergePatternGroup.hasOwnProperty(mergePattern)) {
                            Nodes[editingNode].Output[outputName].Data[mergePattern] = data[mergePatternGroup[mergePattern].replace(/%name/g, outputName)];
                        }
                    }
                }
            }
            return false;
        }

        // Reset editing node, probably move to EditEnd
        editingNode = -1;
    };
}());
