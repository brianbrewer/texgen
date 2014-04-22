/*global brianbrewer */

//@TODO: Complete
(function () {
    "use strict";
    brianbrewer.Nodes.TessellateTriangle = brianbrewer.Nodes.GNode.extend({
        init: function (x, y) {
            this.sup(x, y, "Arbritrary Triangle Tessellation");

            this.Input.Point1 = new brianbrewer.Input("Point", true);
            this.Input.Point2 = new brianbrewer.Input("Point", true);
            this.Input.Point3 = new brianbrewer.Input("Point", true);

            this.Output.Image = new brianbrewer.Output(new brianbrewer.Data.ImageData());

            this.Category = "Tessellate";

            this.CalculateSize();
        },
        Compute: function () {
            this.sup();

            var context,
                triTesselation,
                calculateAttachedTriangle;

            triTesselation = function (boundX, boundY, inputPoints) {
                var canContinue,
                    currentIndex,
                    currentShape,
                    currentSide,
                    currentPair,
                    newShape,
                    shapeBoundX1,
                    shapeBoundY1,
                    shapeBoundX2,
                    shapeBoundY2,
                    isVisible,
                    isDuplicate,
                    exploredShapes = [],
                    linePairs = [],
                    i,
                    j,
                    k;

                // Begin Bredth first tesselation
                exploredShapes.push(inputPoints); // Push initial shape
                canContinue = true;
                currentIndex = 0;

                while (canContinue) {
                    currentShape = exploredShapes[currentIndex]; // Get current parent shape

                    // Calculate rotated duplicate shapes with each side as a rotational origin
                    for (currentSide = 1; currentSide <= 3; currentSide += 1) {

                        // Function that returns 180 rotated shape from selected side
                        newShape = calculateAttachedTriangle(currentShape[0].x, currentShape[0].y, currentShape[1].x, currentShape[1].y, currentShape[2].x, currentShape[2].y, currentSide); // Get new attached shape

                        // Check bounding box of new shape against bounds of drwaing
                        shapeBoundX1 = Infinity;
                        shapeBoundY1 = Infinity;
                        shapeBoundX2 = -Infinity;
                        shapeBoundY2 = -Infinity;
                        for (i = 0; i < 3; i += 1) {
                            shapeBoundX1 = newShape[i].x < shapeBoundX1 ? newShape[i].x : shapeBoundX1;
                            shapeBoundY1 = newShape[i].y < shapeBoundY1 ? newShape[i].y : shapeBoundY1;
                            shapeBoundX2 = newShape[i].x > shapeBoundX2 ? newShape[i].x : shapeBoundX2;
                            shapeBoundY2 = newShape[i].y > shapeBoundY2 ? newShape[i].y : shapeBoundY2;
                        }

                        // Check it collides with boundsX & boundsY
                        isVisible = true;
                        if ((shapeBoundX1 > boundX || shapeBoundX2 < 0) || (shapeBoundY1 > boundY || shapeBoundY2 < 0)) {
                            isVisible = false;
                        }

                        // Check child against all older shapes (Might be faster backwards ?)
                        isDuplicate = false;
                        if (isVisible) {
                            for (i = exploredShapes.length - 1; i >= 0; i -= 1) {
                                if (exploredShapes[i][0].x === newShape[0].x &&
                                        exploredShapes[i][0].y === newShape[0].y &&
                                        exploredShapes[i][1].x === newShape[1].x &&
                                        exploredShapes[i][1].y === newShape[1].y &&
                                        exploredShapes[i][2].x === newShape[2].x &&
                                        exploredShapes[i][2].y === newShape[2].y) {
                                    isDuplicate = true;
                                }
                            }
                        }

                        // Add new shape to list
                        if (isVisible && !isDuplicate) {
                            exploredShapes.push(newShape);
                        }
                    }

                    // End if no more shapes to check
                    if (currentIndex === exploredShapes.length - 1) {
                        canContinue = false;
                    } else {
                        currentIndex += 1;
                    }
                }

                // Condence into unique pairs of points (line)
                for (i = 0; i < exploredShapes.length; i += 1) {
                    for (j = 0; j < 3; j += 1) {
                        // Create pair
                        currentPair = {
                            x1: exploredShapes[i][j].x,
                            y1: exploredShapes[i][j].y,
                            x2: exploredShapes[i][(j + 1) % 3].x,
                            y2: exploredShapes[i][(j + 1) % 3].y
                        };

                        // Check if unique (Both directions)
                        isDuplicate = false;
                        for (k = 0; k < linePairs.length; k += 1) {
                            if ((currentPair.x1 === linePairs[k].x1 && currentPair.y1 === linePairs[k].y1 && currentPair.x2 === linePairs[k].x2 && currentPair.y2 === linePairs[k].y2) ||
                                    (currentPair.x1 === linePairs[k].x2 && currentPair.y1 === linePairs[k].y2 && currentPair.x2 === linePairs[k].x1 && currentPair.y2 === linePairs[k].y1)) {
                                isDuplicate = true;
                                break;
                            }
                        }

                        if (!isDuplicate) {
                            linePairs.push(currentPair);
                        }
                    }
                }


                // Quick Line Draw
                for (i = 0; i < linePairs.length; i += 1) {
                    context.moveTo(linePairs[i].x1, linePairs[i].y1);
                    context.lineTo(linePairs[i].x2, linePairs[i].y2);
                }
                context.stroke();

                return linePairs;
            };

            calculateAttachedTriangle = function (x1, y1, x2, y2, x3, y3, rotside) {
                var midX,
                    midY,
                    pointVX,
                    pointVY,
                    pointVA,
                    pointVL,
                    newPoints = [];

                // Get midpoint of selected side (Default 1)
                if (rotside === 3) {
                    midX = (x3 + x1) / 2;
                    midY = (y3 + y1) / 2;
                } else if (rotside === 2) {
                    midX = (x2 + x3) / 2;
                    midY = (y2 + y3) / 2;
                } else {
                    midX = (x1 + x2) / 2;
                    midY = (y1 + y2) / 2;
                }

                // Angle from (midX,midY) to (x{1,2,3}, y{1,2,3})
                // n = 1
                pointVX = midX - x1;
                pointVY = midY - y1;
                pointVA = Math.atan2(pointVY, pointVX);
                pointVL = Math.sqrt(Math.pow(pointVX, 2) + Math.pow(pointVY, 2));
                newPoints.push({
                    x: Math.round(midX + Math.cos(pointVA) * pointVL),
                    y: Math.round(midY + Math.sin(pointVA) * pointVL)
                });

                // n = 2
                pointVX = midX - x2;
                pointVY = midY - y2;
                pointVA = Math.atan2(pointVY, pointVX);
                pointVL = Math.sqrt(Math.pow(pointVX, 2) + Math.pow(pointVY, 2));
                newPoints.push({
                    x: Math.round(midX + Math.cos(pointVA) * pointVL),
                    y: Math.round(midY + Math.sin(pointVA) * pointVL)
                });

                // n = 3
                pointVX = midX - x3;
                pointVY = midY - y3;
                pointVA = Math.atan2(pointVY, pointVX);
                pointVL = Math.sqrt(Math.pow(pointVX, 2) + Math.pow(pointVY, 2));
                newPoints.push({
                    x: Math.round(midX + Math.cos(pointVA) * pointVL),
                    y: Math.round(midY + Math.sin(pointVA) * pointVL)
                });

                return newPoints;
            };

            // Clear Canvas and reset size if changed
            this.ComputeCanvas.width = brianbrewer.Options.renderWidth;
            this.ComputeCanvas.height = brianbrewer.Options.renderWidth;
            context = this.ComputeCanvas.getContext("2d");

            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, brianbrewer.Options.renderWidth, brianbrewer.Options.renderHeight);

            triTesselation(brianbrewer.Options.renderWidth, brianbrewer.Options.renderHeight, [{
                x: this.Input.Point1.Data.X,
                y: this.Input.Point1.Data.Y
            }, {
                x: this.Input.Point2.Data.X,
                y: this.Input.Point2.Data.Y
            }, {
                x: this.Input.Point3.Data.X,
                y: this.Input.Point3.Data.Y
            }]);

            this.Output.Image.Data.imagedata = context.getImageData(0, 0, brianbrewer.Options.renderWidth, brianbrewer.Options.renderHeight);
        }
    });
}());
