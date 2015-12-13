var LargeAsteroid = (function () {
  function LargeAsteroid() {
    Asteroid.call(this);
    this.setSize(15, 15);
  }; LargeAsteroid.prototype = Object.create(Asteroid.prototype);

  LargeAsteroid.prototype.nextAsteroids = function() {
    return [
      new MediumAsteroid(),
      new MediumAsteroid()
    ];
  };

  return LargeAsteroid;
})();
