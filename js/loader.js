/*jslint browser: true, devel: true */
/*global brianbrewer, chic, toast */
var brianbrewer = brianbrewer || {};
var Class = Class || chic.Class;

/*
 * Sets up the Nodes and Data Objects as well as the
 */
(function () {
    "use strict";
    var testfunction,
        nodeID;

    // NameSpaces
    brianbrewer.Nodes = {};
    brianbrewer.Data = {};
    brianbrewer.Loader = {};

    // Node Identifier
    nodeID = 0;

    //@TODO: Move options to new file (options.js) or main.js
    // Options
    brianbrewer.Options = {
        renderWidth: 256,
        renderHeight: 256
    };

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
            Required: "#00f",
            Optional: "#fff",
            Connected: "#0f0"
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
            this.Connected = false;
        }
    });

    brianbrewer.Output = Class.extend({
        init: function (data) {
            this.Data = data;
            this.Connected = false;
        }
    });

    brianbrewer.Loader.LoadList = [
        "Data|GData",
        "Data|Point",
        "Data|Integer",
        "Data|ImageData",
        "Nodes|GNode",
        "Nodes|Triangle",
        "Nodes|Quadrilateral",
        "Nodes|TessellateTriangle",
        "Nodes|TessellateQuadrilateral",
        "Nodes|Integer",
        "Nodes|Point",
        "Nodes|Final"
    ];

    testfunction = function (type, name) {
        return function () {
            return brianbrewer[type][name];
        };
    };

    // Load /data and /nodes
    brianbrewer.Loader.Load = function (callback) {
        var type,
            name,
            split,
            uri,
            i,
            toload = [];

        for (i = 0; i < brianbrewer.Loader.LoadList.length; i += 1) {
            split = brianbrewer.Loader.LoadList[i].split('|');
            type = split[0];
            name = split[1];

            toload.push(["js/" + type.toLowerCase() + "/" + name.toLowerCase() + ".js", testfunction(type, name)]);
        }

        toast(toload, callback);
    };

    brianbrewer.getNodeID = function () {
        nodeID += 1;
        return nodeID;
    };
}());
