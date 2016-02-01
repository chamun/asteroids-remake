var BoundFixer = (function () {

  var isOffBoundary = function(object, axis) {
    var p = object["get" + axis]();
    var bounds = object.boundary;
    var max = bounds["get" + getDimension(axis)]();
    return p < 0 || p > max;
  };

  var placeInBounds = function(object, axis) {
    var p = object["get" + axis]();
    var bounds = object.boundary;
    var dAxis = Math.sign(-p) * bounds["get" + getDimension(axis)]();
    object["set" + axis](p + dAxis);
  };

  var getDimension = function(axis) {
    return (axis == "X") ? "Width" : "Height";
  }

  return {
    fix: function(object) {
      if (isOffBoundary(object, "X")) { placeInBounds(object, "X"); }
      if (isOffBoundary(object, "Y")) { placeInBounds(object, "Y"); }
    }
  };
})();
