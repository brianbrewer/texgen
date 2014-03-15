/*jslint browser: true, devel: true */
/*global brianbrewer, chic, toast */
var brianbrewer = brianbrewer || {};
var Class = Class || chic.Class;

/*
 * Sets up the Nodes and Data Objects as well as the
 */
(function () {
    "use strict";
    var testfunction;

    // NameSpaces
    brianbrewer.Nodes = {};
    brianbrewer.Data = {};
    brianbrewer.Loader = {};

    //@TODO: Move options to new file (options.js) or main.js
    // Options
    brianbrewer.Options = {
        renderWidth: 500,
        renderHeight: 500
    };

    // NodeStyle
    //@TODO: Update to work with new input design
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

    brianbrewer.Loader.LoadList = [
        "Data|GData",
        "Data|Point",
        "Nodes|GNode",
        "Nodes|Triangle",
        "Nodes|TesselateTriangle"
    ];

    testfunction = function (type, name) {
        return function () {
            return brianbrewer[type][name];
        };
    };

    // Load /data and /nodes
    //@TODO: Clean this up << Success
    brianbrewer.Loader.Load = function () {
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

        toast(toload, function () { console.log("Everything Loaded!"); });
    };

    brianbrewer.Loader.List = function () { console.log(null); };
}());