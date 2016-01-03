var LargeAsteroid = (function () {
  function LargeAsteroid() {
    Asteroid.call(this, 10, [
      new Vector( -10, -30),
      new Vector( -30, -20),
      new Vector( -40, 0),
      new Vector( -30, 20),
      new Vector( -20, 30),
      new Vector( 10, 20),
      new Vector( 20, 10),
      new Vector( 10, -20)
    ]);
  }; LargeAsteroid.prototype = Object.create(Asteroid.prototype);

  LargeAsteroid.prototype.nextAsteroids = function() {
    return [
      new MediumAsteroid(),
      new MediumAsteroid()
    ];
  };

  return LargeAsteroid;
})();
