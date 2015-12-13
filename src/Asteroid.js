var Asteroid = (function () {
  function Asteroid() {
    GameObject.call(this);

    this.setSolid(true);
    this.setColor("Green");
    this.addTag("asteroid");
    this.setBoundary(Quick.getBoundary());

    this.setPosition(randomPoint());
    this.setSpeedX(random(-0.5, 0.5));
    this.setSpeedY(random(-0.5, 0.5));
  }; Asteroid.prototype = Object.create(GameObject.prototype);

  Asteroid.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Asteroid.prototype.spawnAsteroids = function() {
    return this.nextAsteroids().map(function (asteroid) {
      asteroid.setCenter(this.getCenter());
      return asteroid;
    }, this);
  };

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomPoint() {
    var x = Quick.random(Quick.getWidth());
    var y = Quick.random(Quick.getHeight());
    return new Point(x, y);
  }

  return Asteroid;
})();
