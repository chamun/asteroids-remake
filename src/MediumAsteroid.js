var MediumAsteroid = (function () {
  function MediumAsteroid() {
    Asteroid.call(this);
    this.setSize(18, 18);
  }; MediumAsteroid.prototype = Object.create(Asteroid.prototype);

  MediumAsteroid.prototype.nextAsteroids = function() {
    return [
      new SmallAsteroid(),
      new SmallAsteroid(),
      new SmallAsteroid()
    ];
  };

  return MediumAsteroid;
})();
