var BoundFixer = (function () {

  var isOffBoundary = function(object, axis) {
    var p = object["get" + axis]();
    var max = Quick["get" + getDimension(axis)]();
    return p < 0 || p > max;
  };

  var placeInBounds = function(object, axis) {
    var p = object["get" + axis]();
    var dAxis = Math.sign(-p) * Quick["get" + getDimension(axis)]();
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
