var MediumAsteroid = (function () {
  function MediumAsteroid() {
    Asteroid.call(this, 20, [
      new Vector(12, 12),
      new Vector(30, -6),
      new Vector(-6, -18),
      new Vector(-12, -12),
      new Vector(-3.6, 3.6)
    ]);
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
