var Vector = (function () {
  function Vector(x, y) {
    Point.call(this);

    this.setX(x);
    this.setY(y);
  }; Vector.prototype = Object.create(Point.prototype);

  Vector.prototype.rotate = function(angle) {
    var sin = Math.sin(toRad(angle));
    var cos = Math.cos(toRad(angle));
    return this.set(
      this.getX() * cos - this.getY() * sin,
      this.getX() * sin + this.getY() * cos
    );
  };

  Vector.prototype.add = function(p) {
    return this.set(
      this.getX() + p.getX(),
      this.getY() + p.getY()
    );
  };

  Vector.prototype.scale = function(a) {
    return this.set(
     this.getX() * a,
     this.getY() * a
   );
  };

  Vector.prototype.set = function(x, y) {
    this.setX(x);
    this.setY(y);
    return this;
  };

  Vector.scale = function(v, a) {
    var nv = Object.create(v);
    return nv.scale(a);
  };

  function toRad(angle) { return angle * (Math.PI / 180); }

  return Vector;
})();
