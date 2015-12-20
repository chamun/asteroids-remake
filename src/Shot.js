var Shot = (function () {
  var SPEED = 5;

  function Shot(position, direction) {
    GameObject.call(this);
    this.setColor("White");
    this.setSize(1, 1);
    this.setSolid(true);
    this.setPosition(position);
    this.setBoundary(Quick.getBoundary());
    this.setExpiration(50);

    setVelocity.call(this, direction);
  }; Shot.prototype = Object.create(GameObject.prototype);

  Shot.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Shot.prototype.onCollision = function(asteroid) {
    if (this.getScene().isNotAsteroid(asteroid)) return;
    asteroid
      .spawnAsteroids()
      .forEach(this.getScene().add, this.getScene());
    asteroid.expire();
    this.expire();
  };

  function setVelocity(direction) {
    var unitDirection = Vector.unit(direction);
    this.setSpeedX(SPEED * unitDirection.getX());
    this.setSpeedY(SPEED * unitDirection.getY());
  }

  return Shot;
})();
