var LargeAsteroid = (function () {
  function LargeAsteroid() {
    Asteroid.call(this, 10);
    this.setSize(25, 25);
  }; LargeAsteroid.prototype = Object.create(Asteroid.prototype);

  LargeAsteroid.prototype.nextAsteroids = function() {
    return [
      new MediumAsteroid(),
      new MediumAsteroid()
    ];
  };

  return LargeAsteroid;
})();
