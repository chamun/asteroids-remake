var Polygon = (function () {
  function Polygon(points) {
    GameObject.call(this);
    this.setSolid(false);
    this.setColor("White");
    this.points = points;
  }; Polygon.prototype = Object.create(GameObject.prototype);

  Polygon.prototype.render = function(context) {
    var center = this.getCenter();
    var fun = 'moveTo';

    context.strokeStyle = this.getColor();
    context.beginPath();
    this.points
      .concat([this.points[0]])
      .map(function (point) { return Vector.add(point, center); })
      .forEach(function (point, index) {
        context[fun](point.getX(), point.getY());
        fun = 'lineTo';
      });
    context.stroke();
  };

  Polygon.prototype.rotate = function(angle) {
    this.points.forEach(function (point) { point.rotate(angle); });
  };

  return Polygon;
})();
