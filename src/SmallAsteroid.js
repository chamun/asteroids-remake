var SmallAsteroid = (function () {
  function SmallAsteroid() {
    Asteroid.call(this, [
      new Vector(-8, 8),
      new Vector(-4, 12),
      new Vector(4, 12),
      new Vector(8, 8),
      new Vector(8, 4),
      new Vector(0, -4),
      new Vector(-8, 0)
    ]);
  }; SmallAsteroid.prototype = Object.create(Asteroid.prototype);

  SmallAsteroid.prototype.nextAsteroids = function() { return []; };

  SmallAsteroid.prototype.getExplosionSoundId = function() {
    return "bangSmall";
  };

  SmallAsteroid.prototype.getScore = function() { return 30 };

  return SmallAsteroid;
})();
