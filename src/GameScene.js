var GameScene = (function () {
  var FRAGMENT_EXPIRATION = 75;

  function GameScene() {
    Scene.call(this);

    this.scheduler = new Scheduler();
    this.add(this.scheduler);

    this.add(new Background());
    this.add(new Player());
    for (var i = 0; i < 2; ++i) this.add(new LargeAsteroid());
    for (var i = 0; i < 2; ++i) this.add(new MediumAsteroid());
    for (var i = 0; i < 2; ++i) this.add(new SmallAsteroid());
  }; GameScene.prototype = Object.create(Scene.prototype);

  GameScene.prototype.onAsteroidHit = function (asteroid, object) {
    if (!asteroid.hasTag("asteroid")) return;
    asteroid
      .spawnAsteroids()
      .forEach(this.add, this);
    asteroid.expire();
    object.expire();
    if (object.hasTag("player")) { killPlayer.call(this, object); }
  }

  function killPlayer(player) {
    addFragments.call(this, 60, player.getCenter(), player.getVelocity());
    this.scheduler.schedule(FRAGMENT_EXPIRATION, function () {
      this.add(new Player());
    }, this);
  };

  function addFragments(count, position, velocity) {
    while(--count > 0) {
      var exp = 1 + Quick.random(
        FRAGMENT_EXPIRATION - 20,
        FRAGMENT_EXPIRATION
      );
      this.add(new Fragment(exp, position, velocity));
    }
  }

  return GameScene;
})();
