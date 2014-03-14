/*jslint browser: true, devel: true */
/*global $, Snap, brianbrewer */

var brianbrewer = brianbrewer || {};

brianbrewer.Interface = brianbrewer.Interface || (function () {
    "use strict";

    // Functions
    var initialise,
        setupSnap,
        setupToolDrawer,
    //Variables
        snapObject,
        Canvas = {
            App: null,
            Nodes: null,
            Connection: null
        },
        Context = {
            App: null,
            Nodes: null,
            Connection: null
        },
        Options = {
            RenderWidth: 512,
            RenderHeight: 512
        };

    /**
     * Description.
     */
    initialise = function () {
        setupSnap();
        //brianbrewer.Loader.Load(); //@TODO: Wait till @ home

        // Setup canvas' and contexts
        Canvas.App = document.getElementById("app-canvas");
        Context.App = Canvas.App.getContext("2d");
        Canvas.App.width = $("#content").width();
        Canvas.App.height = $("#content").height() - $(".navbar").height();

        Canvas.Nodes = document.createElement("canvas");
        Context.Nodes = Canvas.Nodes.getContext("2d");
        Canvas.Nodes.width = Canvas.App.width;
        Canvas.Nodes.height = Canvas.App.height;

        Canvas.Connection = document.createElement("canvas");
        Context.Connection = Canvas.Connection.getContext("2d");
        Canvas.Connection.width = Canvas.App.width;
        Canvas.Connection.height = Canvas.App.height;

        //@FIXME Test canvas
        Context.App.moveTo(0, 0);
        Context.App.lineTo(Canvas.App.width, Canvas.App.height);
        Context.App.stroke();
    };

    /**
     * Description.
     */
    setupSnap = function () {
        // Setup sliding menu functionality
        snapObject = new Snap({
            element: document.getElementById('content'),
            disable: 'none',
            hyperextensible: true,
            touchToDrag: true,
            maxPosition: 200,
            minPosition: -200
        });

        // Slide left button functionality
        $(".open-left").on("click", function () {
            if (snapObject.state().state === "left") {
                snapObject.close();
            } else {
                snapObject.open("left");
            }
        });

        // Slide right button functionality
        $(".open-right").on("click", function () {
            if (snapObject.state().state === "right") {
                snapObject.close();
            } else {
                snapObject.open("right");
            }
        });
    };

    /*
     * Description.
     */
    setupToolDrawer = function () {
        var node,
            categoryNodes = [],
            newCategoryNode,
            newToolNode,
            categoryFound,
            i;

        //@TODO: Finish functionality
        for (node in brianbrewer.Nodes) {
            if (brianbrewer.Nodes.hasOwnProperty(node) && node !== "GNode") {

                // Check to see if category already exists
                categoryFound = false;
                for (i = 0; i < categoryNodes.length; i += 1) {
                    // Create new node
                    newToolNode = document.createElement("li");
                    newToolNode.classList.add("tool");
                    newToolNode.innerHTML = brianbrewer.Nodes[node].Title;

                    if ("group-" + brianbrewer.Nodes[node].Category.toLowerCase() === categoryNodes[i].id) {
                        // Add tool to preexisting category
                        categoryNodes[i].appendChild(newToolNode);
                        categoryFound = true;
                        break;
                    }
                }

                if (!categoryFound) {
                    // Create Group and add
                    newCategoryNode = document.createElement("ul");
                    newCategoryNode.dataset.heading = brianbrewer.Nodes[node].Category.toLowerCase();
                    newCategoryNode.appendChild(newToolNode);
                }
            }
        }
        console.log(categoryNodes);
    };

    return {
        Initialise: initialise,
        Options: Options,
        drawer: setupToolDrawer //@FIXME: Change name / remove
    };
}());

$(window).ready(brianbrewer.Interface.Initialise);
