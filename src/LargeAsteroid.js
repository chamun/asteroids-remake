var LargeAsteroid = (function () {
  function LargeAsteroid() {
    Asteroid.call(this);
    this.setSize(15, 15);
  }; LargeAsteroid.prototype = Object.create(Asteroid.prototype);

  return LargeAsteroid;
})();
