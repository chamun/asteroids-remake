var SmallAsteroid = (function () {
  function SmallAsteroid() {
    Asteroid.call(this);
    this.setSize(5, 5);
  }; SmallAsteroid.prototype = Object.create(Asteroid.prototype);

  return SmallAsteroid;
})();
