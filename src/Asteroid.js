var Asteroid = (function () {
  function Asteroid(points) {
    Polygon.call(this, points);

    this.setSolid(true);
    this.setColor("Green");
    this.addTag("asteroid");
    this.setBoundary(Quick.getBoundary());

    this.setPosition(randomPoint());
  }; Asteroid.prototype = Object.create(Polygon.prototype);

  Asteroid.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Asteroid.prototype.spawnAsteroids = function() {
    return this.nextAsteroids().map(function (asteroid) {
      asteroid.setCenter(this.getCenter());
      return asteroid;
    }, this);
  };

  function randomPoint() {
    var x = Quick.random(Quick.getWidth());
    var y = Quick.random(Quick.getHeight());
    return new Point(x, y);
  }

  return Asteroid;
})();
