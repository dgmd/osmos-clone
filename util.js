// Some basic functions for degree/radian conversion
function toRadians(degrees) { return degrees * (Math.PI / 180);}
function toDegrees(radians) { return radians * (180 / Math.PI);}

// Comparing arrays; unfortunately, JS does not have an ==; here we modify
// the Array prototype directly
Array.prototype.equals = function (array) {
    if (!array) { return false; }
    else if (this.length != array.length) { return false; }
    // else
    for (var i = 0, l = this.length; i < l; i++) {
        // Check for nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse
            if (!this[i].equals(array[i])) { return false; }
        }
        else if (this[i] != array[i]) { return false; }
    }

    // If we get to the end, we've checked all the elements
    return true;
};

function unitVector(vector) {
    return vector.map(function(v) { return parseFloat(v)/norm(vector); });
}

function norm(vector) {
    return Math.sqrt(vector.map(
        function(v) { return v*v; }).reduce(
            function(a, b) { return a + b; }));
}

function angleOf(vector) { return Math.atan(vector[1]/vector[0]); }

function angleBetween(point1, point2) {
    var angle = angleOf(
        point1.map(
            function(c, i) {
                return c - point2[i];
            }));

    return angle;
}

function distance(point1, point2) {
    return Math.sqrt(
        point2.map(
            function(c, i) { return c - point1[i]; }).map(
                function(d) { return d*d; }).reduce(
                    function(a, b) { return a + b; }));
}