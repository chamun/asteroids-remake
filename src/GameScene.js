var GameScene = (function () {
  function GameScene() {
    Scene.call(this);

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
  };

  function addFragments(count, position, velocity) {
    while(--count > 0) {
      this.add(new Fragment(position, velocity));
    }
  }

  return GameScene;
})();
