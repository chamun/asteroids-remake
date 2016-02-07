var Polygon = (function () {
  function Polygon(points) {
    GameObject.call(this);
    this.setSolid(false);
    this.setColor("White");
    this.points = points;
    setDimensions.call(this);
  }; Polygon.prototype = Object.create(GameObject.prototype);

  Polygon.prototype.render = function(context) {
    var center = this.getCenter();
    var fun = 'moveTo';

    context.strokeStyle = this.getColor();
    if (this.fillColor !== undefined) {
      context.fillStyle = this.fillColor;
    }
    context.beginPath();
    this.points
      .concat([this.points[0]])
      .map(function (point) { return Vector.add(point, center); })
      .forEach(function (point, index) {
        context[fun](point.getX(), point.getY());
        fun = 'lineTo';
      });
    if (this.fillColor !== undefined) {
      context.fill();
    }
    context.stroke();
  };

  Polygon.prototype.rotate = function(angle) {
    this.points.forEach(function (point) { point.rotate(angle); });
    setDimensions.call(this);
  };

  function setDimensions() {
    var rect = this.points.reduce(function (rect, point) {
      return {
        minx: Math.min(point.getX(), rect.minx),
        miny: Math.min(point.getY(), rect.miny),
        maxx: Math.max(point.getX(), rect.maxx),
        maxy: Math.max(point.getY(), rect.maxy)
      };
    }, {
      minx: Infinity,
      miny: Infinity,
      maxx: -Infinity,
      maxy: -Infinity
    });

    this.setSize(
      rect.maxx - rect.minx,
      rect.maxy - rect.miny
    );
  }

  return Polygon;
})();
