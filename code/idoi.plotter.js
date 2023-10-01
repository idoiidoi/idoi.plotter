sketch.default2d();

var data = [];
var maxDataPoints = 300;
var colorSet = [];
var removedDataPoints = 0;
var lineStep = 100;
var movingAverages = [];
var yBounds = { min: 0, max: 1}; 
var mouseState = { lastY: 0, lastRightClickY: 0 };
var autoScaling = false;
var lineWidth = 1.0;  // Default line width
var windowSize = 3;  // default 3
var interpolation_v = false;

function autoscale(mode) {
    autoScaling = !!mode;
    paint();
    refresh();
}

function ybounds(min, max) {
    yBounds.min = min;
    yBounds.max = max;
    autoscale(0);  // Disable autoscale when yBounds is set manually
    paint();
    refresh();
}

function windowsize(newSize) {
    if (typeof newSize === 'number' && newSize > 0) {
        windowSize = newSize;
        post("Window size set to:", windowSize, "\n");
    } else {
        post("Invalid window size value\n");
    }

    // recalculateMovingAverages(windowSize);
    // paint();
    // refresh();
}



function onclick(x, y, but, cmd, shift, capslock, option, ctrl) {
    if (autoScaling) {
        autoscale(0);  // Disable autoscale when there is mouse interaction
    }
    mouseState.lastY = y;
    if (but && ctrl) {
        mouseState.lastRightClickY = y;
    }
}
onclick.local = 1;

function ondrag(x, y, but, cmd, shift, capslock, option, ctrl) {

    if (autoScaling) {
        autoscale(0);  // Disable autoscale when there is mouse interaction
    }

    if (!autoScaling) {
        if (but && ctrl) {
            var yDelta = y - mouseState.lastRightClickY;
            yBounds.min += yDelta * 0.01;
            yBounds.max += yDelta * 0.01;

            paint();
            refresh();

            mouseState.lastRightClickY = y;
            mouseState.lastY = y;
            return;
        }

        var dy = y - mouseState.lastY;
        var range = yBounds.max - yBounds.min;
        var scale_factor = 1 + dy * 0.01;

        var newRange = range * scale_factor;
        var center = (yBounds.min + yBounds.max) / 2;
        yBounds.min = center - newRange / 2;
        yBounds.max = center + newRange / 2;

        paint();
        refresh();

        mouseState.lastY = y;
    }
}
ondrag.local = 1;

function ondblclick(x, y, but, cmd, shift, capslock, option, ctrl) {
    autoscale(autoScaling ? 0 : 1);
    paint();
    refresh();
}
ondblclick.local = 1;

function generateColors(n) {
    var colors = [];
    for (var i = 0; i < n; i++) {
        var hue = (i / n) * 360;
        var rgb = hslToRgb(hue / 360, 0.7, 0.5);
        colors.push(rgb);
    }
    return colors;
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; 
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b];
}

function setColor(idx, r, g, b) {
    // idx: 色を変更するデータのインデックス
    // r, g, b: 新しい色のRGB値 (0-1の範囲)

    if (colorSet[idx]) {
        colorSet[idx] = [r, g, b];
        paint();
        refresh();
    } else {
        post("Invalid index provided for setColor.\n");
    }
}

var movingSums = [];

function linewidth(newWidth) {
    if (newWidth > 0) {
        lineWidth = newWidth;
        paint();
        refresh();
    } else {
        post("Invalid line width provided.\n");
    }
}

function calculateMovingAverage(data, index, windowSize) {
    if (index < windowSize) {
        var sum = 0;
        for (var i = 0; i <= index; i++) {
            sum += data[i];
        }
        movingSums[index] = sum;
        return sum / (index + 1);
    } else {
        var newSum = movingSums[index - 1] - data[index - windowSize] + data[index];
        movingSums[index] = newSum;
        return newSum / windowSize;
    }
}




function interpolation(mode) {
    interpolation_v = mode;
    paint();
    refresh();
}

function updateMovingAverage(newDataPoint, colorIdx, windowSize) {
    if (!movingAverages[colorIdx]) {
        movingAverages[colorIdx] = [];
    }
    
    var lastValue = movingAverages[colorIdx].length > 0 ? movingAverages[colorIdx][movingAverages[colorIdx].length - 1] : 0;
    var oldDataValue = data.length > windowSize ? data[data.length - windowSize][colorIdx] : 0;
    
    var newAverage = lastValue + (newDataPoint - oldDataValue) / windowSize;
    movingAverages[colorIdx].push(newAverage);
    
    return newAverage;
}


function recalculateMovingAverages(windowSize) {
    movingAverages = [];
    for (var i = 0; i < data.length; i++) {
        for (var colorIdx = 0; colorIdx < colorSet.length; colorIdx++) { 
            if (!movingAverages[colorIdx]) {
                movingAverages[colorIdx] = [];
            }
            if (data[i] && data[i][colorIdx] !== undefined) { 
                var value = calculateMovingAverage(data.map(function(d) { return d[colorIdx] !== undefined ? d[colorIdx] : 0; }), i, windowSize);

                movingAverages[colorIdx].push(value);
            } else {
                movingAverages[colorIdx].push(0); 
            }
        }
    }
}

function list() {
    var args = arrayfromargs(arguments);

     // Check if colorSet needs to be generated
     if (colorSet.length !== args.length) {
        colorSet = generateColors(args.length);
    }
    data.push(args);

    while (data.length > maxDataPoints) {
        data.shift();
        removedDataPoints++;
        movingAverages.forEach(function(avg) {
            avg.shift();
        });
    }
    
    for (var colorIdx = 0; colorIdx < args.length; colorIdx++) {
        updateMovingAverage(args[colorIdx], colorIdx, windowSize);

    }

    if (autoScaling) {
        // yMinとyMaxを再計算
        recalculateYBounds();
    }

    paint();
    refresh();
}


function recalculateYBounds() {
    var minY = Infinity;
    var maxY = -Infinity;
    
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            minY = Math.min(minY, data[i][j]);
            maxY = Math.max(maxY, data[i][j]);
        }
    }
    
    yBounds = { min: minY, max: maxY };
    paint();
    refresh();
}





function paint() {
    with (sketch) {
    
        
        glclearcolor(1, 1, 1, 0); 
        glclear();

        var aspectRatio = (box.rect[2] - box.rect[0]) / (box.rect[3] - box.rect[1]);
        var xStart = -aspectRatio;
        var textOffsetPixel = 10;  // Offset for text in pixels
        var panelHeight = box.rect[3] - box.rect[1];
        var textOffset = (textOffsetPixel / panelHeight) * 2;  // Convert to OpenGL coordinate system
        

        var xEnd = Math.max(1, aspectRatio);
        var step = (xEnd - xStart) / (data.length - 1);





   
        glcolor(0.7, 0.7, 0.7, 1); 
        var numberOfLines = Math.floor((data.length + removedDataPoints) / lineStep); // ここで lineStep を使用
        for (var i = 0; i <= numberOfLines; i++) {
            var xPos = xEnd - ((data.length + removedDataPoints - 1) - i * lineStep) * step; // ここで lineStep を使用
            if (xPos >= xStart && xPos <= xEnd) {
                moveto(xPos, -1); 
                lineto(xPos, 1);
            }
        }






        for (var colorIdx = 0; colorIdx < colorSet.length; colorIdx++) {
            glcolor(colorSet[colorIdx][0], colorSet[colorIdx][1], colorSet[colorIdx][2], 1); 
            gllinewidth(lineWidth);
            for (var i = 0; i < data.length; i++) {
                var rawValue = interpolation_v ? movingAverages[colorIdx][i] : data[i][colorIdx];
                var value = mapValue(rawValue, yBounds.min, yBounds.max, -1, 1);
                var xPos = xStart + i * step;
                if (i === 0) {
                    moveto(xPos, value);
                } else {
                    lineto(xPos, value);
                }
            }
        }

   
    glcolor(0, 0, 0, 1); 
    var xOffset = xStart;

    moveto(xOffset, 1-textOffset);
    text(yBounds.max.toFixed(2));

    
    moveto(xOffset, -1.0 + 0.5*textOffset);
    text(yBounds.min.toFixed(2));

    }
}



function lineinterval(step) {
    lineStep = step;
    paint();
    refresh();
}



function mapValue(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


function onresize() {
    paint();
}

function clear() {
    data = [];  // Clear the data
    movingAverages = []; // Also clear the moving averages
    removedDataPoints = 0;
    colorSet = []; // Reset the colorSet to its initial state
    lineWidth = 1.;
    lineStep = 100;
    yBounds = { min: 0, max: 1 }
    autoScaling=0;
    paint();
}
onresize.local = 1;
