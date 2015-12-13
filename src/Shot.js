var Shot = (function () {
  var SPEED = 2;

  function Shot(position, direction) {
    GameObject.call(this);
    this.setColor("White");
    this.setSize(1, 1);
    this.setPosition(position);
    this.setBoundary(Quick.getBoundary());
    this.setExpiration(50);

    setVelocity.call(this, direction);
  }; Shot.prototype = Object.create(GameObject.prototype);

  Shot.prototype.offBoundary = function() { BoundFixer.fix(this) };

  function setVelocity(direction) {
    var unitDirection = Vector.unit(direction);
    this.setSpeedX(SPEED * unitDirection.getX());
    this.setSpeedY(SPEED * unitDirection.getY());
  }

  return Shot;
})();
