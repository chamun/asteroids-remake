var Shot = (function () {
  var SPEED = 5;

  function Shot(position, direction, initialVelocity) {
    GameObject.call(this);
    this.setColor("White");
    this.setSize(1, 1);
    this.setSolid(true);
    this.setPosition(position);
    this.setBoundary(Quick.getBoundary());
    this.setExpiration(50);

    setVelocity.call(this, direction, initialVelocity);
  }; Shot.prototype = Object.create(GameObject.prototype);

  Shot.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Shot.prototype.onCollision = function(asteroid) {
    this.getScene().onAsteroidHit(asteroid, this);
  };

  function setVelocity(direction, initialVelocity) {
    var unitDirection = Vector.unit(direction);
    this.setSpeedX(SPEED * unitDirection.getX() + initialVelocity.getX());
    this.setSpeedY(SPEED * unitDirection.getY() + initialVelocity.getY());
  }

  return Shot;
})();
