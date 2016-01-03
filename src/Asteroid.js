var Asteroid = (function () {
  function Asteroid(score, points) {
    Polygon.call(this, points);

    this.setSolid(true);
    this.setColor("Green");
    this.addTag("asteroid");
    this.setBoundary(Quick.getBoundary());

    this.setPosition(randomPoint());
    this.setSpeedX(random(-0.5, 0.5));
    this.setSpeedY(random(-0.5, 0.5));
    this.score = score;
  }; Asteroid.prototype = Object.create(Polygon.prototype);

  Asteroid.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Asteroid.prototype.spawnAsteroids = function() {
    return this.nextAsteroids().map(function (asteroid) {
      asteroid.setCenter(this.getCenter());
      return asteroid;
    }, this);
  };

  Asteroid.prototype.getScore = function() { return this.score; };

  function randomPoint() {
    var x = Quick.random(Quick.getWidth());
    var y = Quick.random(Quick.getHeight());
    return new Point(x, y);
  }

  return Asteroid;
})();
