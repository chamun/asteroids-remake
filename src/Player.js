var Player = (function () {
  var MAX_SPEED = 3;

  Player.POINT_LIST = function () {
    return [
      new Vector(0, -10),
      new Vector(10, 10),
      new Vector(-10, 10)
    ]
  };

  Player.COLOR = "white";

  function Player() {
    Polygon.call(this, Player.POINT_LIST());
    this.setSolid(true);
    this.setColor(Player.COLOR);
    this.addTag("player");
    this.setBoundary(Quick.getBoundary());
    this.heading = new Vector(0, -0.1);
    this.velocity = (new Vector(0, 0)).setLimit(MAX_SPEED);
    this.gracePeriod = 100;

    this.setCenter(CanvasCenter());
  }; Player.prototype = Object.create(Polygon.prototype);

  Player.prototype.update = function() {
    this.updateOrientation();
    this.updateVelocity();
    this.gracePeriod--;
    if (this.canShoot()) { this.shoot(); }
  };

  Player.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Player.prototype.onCollision = function(asteroid) {
    if (!isGracePeriodOver.call(this)) return;
    this.getScene().onAsteroidHit(asteroid, this);
  };

  Player.prototype.updateVelocity = function() {
    this.setSpeedX(this.velocity.getX());
    this.setSpeedY(this.velocity.getY());
  };

  Player.prototype.updateOrientation = function() {
    if (Quick.getController().keyDown(CommandEnum.LEFT)) { this.rotateLeft(); }
    if (Quick.getController().keyDown(CommandEnum.RIGHT)) { this.rotateRight(); }
    if (Quick.getController().keyDown(CommandEnum.UP)) { this.thrust(); }
  };

  Player.prototype.rotateLeft = function() {
    this.heading.rotate(-5);
    this.rotate(-5);
  };

  Player.prototype.rotateRight = function() {
    this.heading.rotate(5);
    this.rotate(5);
  };

  Player.prototype.thrust = function() {
    this.velocity.add(this.heading);
    addThrustFragments.call(this, 10);
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
    Polygon.prototype.render.call(this, context);

    if (!isGracePeriodOver.call(this)) {
      context.lineWidth = 3;
      context.strokeStyle = '#d0d027';
      context.beginPath();
      context.arc(this.getCenterX(), this.getCenterY(), 14, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  function isGracePeriodOver() { return this.gracePeriod <= 0; }

  function addThrustFragments(number) {
    var colors = ["red", "orange", "yellow"];
    var velocity = Vector.scale(this.heading, -60);
    var position = Vector.add(this.getCenter(), velocity);
    for (var i = 0; i < number; ++i) {
      var fragment = new Fragment(2, position, velocity)
      fragment.setColor(colors[Quick.random(2)]);
      this.scene.add(fragment);
    }
  }

  return Player;
})();
