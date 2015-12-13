var SmallAsteroid = (function () {
  function SmallAsteroid() {
    Asteroid.call(this);
    this.setSize(5, 5);
  }; SmallAsteroid.prototype = Object.create(Asteroid.prototype);

  SmallAsteroid.prototype.nextAsteroids = function() { return []; };

  return SmallAsteroid;
})();
