var Vector = (function () {
  function Vector(x, y) {
    Point.call(this);

    this.setX(x);
    this.setY(y);
    this.limit = Infinity;
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
    if (shouldFixLimit.call(this)) {
      var mag = this.magnitude()
      this.setX(this.getX() / mag * this.limit);
      this.setY(this.getY() / mag * this.limit);
    }
    return this;
  };

  Vector.prototype.magnitude = function() {
    return Math.sqrt(magSquared.call(this));
  };

  Vector.prototype.setLimit = function(limit) {
    this.limit = limit;
    return this.set(
      this.getX(),
      this.getY()
    );
  };

  Vector.scale = function(v, a) {
    var nv = new Vector(v.getX(), v.getY());
    return nv.scale(a);
  };

  Vector.unit = function(v) {
    var mag = v.magnitude();
    return new Vector(
      v.getX() / mag,
      v.getY() / mag
    );
  };

  function magSquared() {
    return this.getX() * this.getX() +
      this.getY() * this.getY();
  }

  function shouldFixLimit() {
    return magSquared.call(this) > this.limit * this.limit;
  }

  function toRad(angle) { return angle * (Math.PI / 180); }

  return Vector;
})();
