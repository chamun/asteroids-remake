var SmallAsteroid = (function () {
  function SmallAsteroid() {
    Asteroid.call(this, 30);
    this.setSize(10, 10);
  }; SmallAsteroid.prototype = Object.create(Asteroid.prototype);

  SmallAsteroid.prototype.nextAsteroids = function() { return []; };

  return SmallAsteroid;
})();
