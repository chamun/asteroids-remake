var AsteroidsFactory = (function () {

  function AsteroidsFactory(level) {
    this.level = level;
  };

  function speedMultiplier() {
    this.speedMultiplier = this.speedMultiplier || this.level / 8 + 1;
    return this.speedMultiplier;
  }

  function randomSpeed() {
    return random(-0.5, 0.5) * speedMultiplier.call(this);
  }

  function extraAstroids() {
    var extraAstroids = []
    var quantity = Math.floor(this.level / 5);
    for (var i = 0; i < quantity; ++i) {
      extraAstroids.push(new LargeAsteroid());
    }
    return extraAstroids;
  }

  function defaultAsteroids() {
    return [
      new LargeAsteroid(),
      new LargeAsteroid(),
      new MediumAsteroid(),
      new MediumAsteroid(),
      new SmallAsteroid(),
      new SmallAsteroid()
    ];
  }

  AsteroidsFactory.prototype.setSpeed = function(asteroid) {
    asteroid.setSpeedX(randomSpeed.call(this));
    asteroid.setSpeedY(randomSpeed.call(this));
    return asteroid;
  };

  AsteroidsFactory.prototype.getAsteroids = function() {
    return defaultAsteroids()
      .concat(extraAstroids.call(this))
      .map(this.setSpeed, this);
  };

  return AsteroidsFactory;
})();
