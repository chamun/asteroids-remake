var Player = (function () {
  var MAX_SPEED = 3;
  function Player() {
    GameObject.call(this);
    this.setSolid(true);
    this.setColor("Red");
    this.setSize(10, 10);
    this.addTag("player");
    this.setBoundary(Quick.getBoundary());
    this.heading = new Vector(0, -0.1);
    this.velocity = (new Vector(0, 0)).setLimit(MAX_SPEED);

    this.setPosition(CanvasCenter());
  }; Player.prototype = Object.create(GameObject.prototype);

  Player.prototype.update = function() {
    this.updateOrientation();
    this.updateVelocity();
    if (this.canShoot()) { this.shoot(); }
  };

  Player.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Player.prototype.onCollision = function(asteroid) {
    this.getScene().onAsteroidHit(asteroid, this);
  };

  Player.prototype.updateVelocity = function() {
    this.setSpeedX(this.velocity.getX());
    this.setSpeedY(this.velocity.getY());
  };

  Player.prototype.updateOrientation = function() {
    if (Quick.getController().keyDown(CommandEnum.LEFT)) {
      this.heading.rotate(-5);
    }
    if (Quick.getController().keyDown(CommandEnum.RIGHT)) {
      this.heading.rotate(5);
    }
    if (Quick.getController().keyDown(CommandEnum.UP)) {
      this.velocity.add(this.heading);
    }
  };

  Player.prototype.canShoot = function() {
    return Quick.getController().keyPush(CommandEnum.A)
  };

  Player.prototype.shoot = function() {
    this.getScene().add(new Shot(
      this.getCenter(),
      this.heading,
      this.velocity
    ));
  };

  Player.prototype.getVelocity = function() { return this.velocity; };

  Player.prototype.render = function(context) {
    GameObject.prototype.render.call(this, context);
    var lineTo = Vector
      .scale(this.heading, 50)
      .add(this.getCenter());

    context.strokeStyle = "#adff29"
    context.beginPath();
    context.moveTo(this.getCenterX(), this.getCenterY());
    context.lineTo(lineTo.getX(), lineTo.getY());
    context.stroke();
  };

  return Player;
})();
